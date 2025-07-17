"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import FileInput from "@/components/health-space/reflection/FileInput";
import FormField from "@/components/health-space/reflection/FormField";
import {getThumbnailUploadUrl } from "@/utils/bunny/bunny";
import {useFileInput} from "@/utils/bunny/useFileInput";
import {MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE, VideoFormValues} from "@/components/health-space/reflection/index";
import {Button} from "@/components/ui/button";
import { useVideoUploadUrlMutation } from "@/hooks/videos/useVideoUploadUrlMutation";
import { useUploadFileToBunnyMutation } from "@/hooks/videos/useUploadFileToBunnyMutation";
import { useSaveVideoDetailsMutation } from "@/hooks/videos/useSaveVideoDetailsMutation";
import { toast } from 'sonner';
import { DefaultLoader } from "@/components/shared/loaders/DefaultLoader";


const VideoUploadForms = ({open, setOpen }: {open: boolean, setOpen: (open: boolean) => void}) => {

  // Mutations 
  const { getVideoUploadUrlAsync } = useVideoUploadUrlMutation();
  const { uploadFileToBunnyAsync } = useUploadFileToBunnyMutation();
  const { saveVideoDetailsAsync } = useSaveVideoDetailsMutation();

  // State 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [formData, setFormData] = useState<VideoFormValues>({
    title: "",
    description: "",
    visibility: "public",
  });
  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

  useEffect(() => {
    if (video.duration !== null) {
      setVideoDuration(video.duration);
    }
  }, [video.duration]);

  useEffect(() => {
    const checkForRecordedVideo = async () => {
      try {
        const stored = sessionStorage.getItem("recordedVideo");
        if (!stored) return;

        const { url, name, type, duration } = JSON.parse(stored);
        const blob = await fetch(url).then((res) => res.blob());
        const file = new File([blob], name, { type, lastModified: Date.now() });

        if (video.inputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          video.inputRef.current.files = dataTransfer.files;

          const event = new Event("change", { bubbles: true });
          video.inputRef.current.dispatchEvent(event);

          video.handleFileChange({
            target: { files: dataTransfer.files },
          } as ChangeEvent<HTMLInputElement>);
        }

        if (duration) setVideoDuration(duration);

        sessionStorage.removeItem("recordedVideo");
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error loading recorded video:", err);
      }
    };

    checkForRecordedVideo();
  }, [video]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const toastId = toast('Sonner');

    setIsSubmitting(true);
    toast.loading("Processing video... This may take a few minutes, please wait", {id: toastId, duration: 0});
    try {
      if (!video.file || !thumbnail.file) {
        setError("Please upload video and thumbnail files.");
        return;
      }

      if (!formData.title || !formData.description) {
        setError("Please fill in all required fields.");
        return;
      }

      // 1. Await the result of the mutation directly
      const { videoId, uploadUrl: videoUploadUrl, accessKey: videoAccessKey } = await getVideoUploadUrlAsync();

      // 2. The code will now pause here until the data is fetched.
      // You can now confidently use the returned data for subsequent steps.
      console.log("Successfully fetched video upload data: ", { videoId, videoUploadUrl });

      if (!videoUploadUrl || !videoAccessKey)
        throw new Error("Failed to get video upload credentials");

      await uploadFileToBunnyAsync({file: video.file, uploadUrl: videoUploadUrl, accessKey: videoAccessKey});

      const {
        uploadUrl: thumbnailUploadUrl,
        cdnUrl: thumbnailCdnUrl,
        accessKey: thumbnailAccessKey,
      } = await getThumbnailUploadUrl(videoId);


      if (!thumbnailUploadUrl || !thumbnailCdnUrl || !thumbnailAccessKey)
        throw new Error("Failed to get thumbnail upload credentials");

      await uploadFileToBunnyAsync({file: thumbnail.file, uploadUrl: thumbnailUploadUrl, accessKey: thumbnailAccessKey});

      await saveVideoDetailsAsync({
        video_id: videoId,
        thumbnail_url: thumbnailCdnUrl,
        ...formData,
        duration: videoDuration,
      });

      toast.success("Video uploaded successfully", {id: toastId});
      //clear form 
      setFormData({
        title: "",
        description: "",
        visibility: "public",
      });
      video.resetFile();
      thumbnail.resetFile();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to upload video", {id: toastId});
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[95%] sm:max-w-lg max-sm:max-h-[80vh] overflow-y-auto"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Upload a video</DialogTitle>
        </VisuallyHidden>
          {error && <div className="text-sm text-red-500">{error}</div>}
        <form
          className="gap-2 w-full flex flex-col items-start shadow-8"
          onSubmit={onSubmit}
        >
          <h4 className={"font-semibold text-lg"}>Upload a video</h4>
          <FormField
            id="title"
            label="Title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a clear and concise video title"
          />

          <FormField
            id="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Briefly describe what this video is about"
            as="textarea"
          />

          <FileInput
            id="video"
            label="Video"
            labelDescription="larger videos may take longer to upload"
            accept="video/*"
            file={video.file}
            previewUrl={video.previewUrl}
            inputRef={video.inputRef}
            onChange={video.handleFileChange}
            onReset={video.resetFile}
            type="video"
          />

          <FileInput
            id="thumbnail"
            label="Thumbnail"
            accept="image/*"
            file={thumbnail.file}
            previewUrl={thumbnail.previewUrl}
            inputRef={thumbnail.inputRef}
            onChange={thumbnail.handleFileChange}
            onReset={thumbnail.resetFile}
            type="image"
          />

          <FormField
            id="visibility"
            label="Visibility"
            labelDescription="public videos are seen by anyone"
            value={formData.visibility}
            onChange={handleInputChange}
            as="select"
            options={[
              {value: "public", label: "Public"},
              {value: "private", label: "Private"},
            ]}
          />
          <Button
            className={"mt-4 w-full flex rounded-lg bg-lavender-500 hover:bg-lavender-600 text-white "}
            disabled={isSubmitting}
          >
            {isSubmitting ?(
              <span className="flex items-center gap-2">
                <DefaultLoader size={20} />
                <p>Uploading...</p>
              </span>
            ) : "Upload Video"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default VideoUploadForms;
