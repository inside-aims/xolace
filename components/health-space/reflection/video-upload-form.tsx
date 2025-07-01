"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

import { useRouter } from "next/navigation";
import FileInput from "@/components/health-space/reflection/FileInput";
import FormField from "@/components/health-space/reflection/FormField";
import {getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails} from "@/utils/bunny/bunny";
import {useFileInput} from "@/utils/bunny/useFileInput";
import {MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE, VideoFormValues} from "@/components/health-space/reflection/index";
import {Button} from "@/components/ui/button";

const uploadFileToBunny = (
  file: File,
  uploadUrl: string,
  accessKey: string
): Promise<void> =>
  fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      AccessKey: accessKey,
    },
    body: file,
  }).then((response) => {
    if (!response.ok)
      throw new Error(`Upload failed with status ${response.status}`);
  });

const VideoUploadForms = ({open, setOpen }: {open: boolean, setOpen: (open: boolean) => void}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [formData, setFormData] = useState<VideoFormValues>({
    title: "",
    description: "",
    tags: "",
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

    setIsSubmitting(true);

    try {
      if (!video.file || !thumbnail.file) {
        setError("Please upload video and thumbnail files.");
        return;
      }

      if (!formData.title || !formData.description) {
        setError("Please fill in all required fields.");
        return;
      }

      const {
        videoId,
        uploadUrl: videoUploadUrl,
        accessKey: videoAccessKey,
      } = await getVideoUploadUrl();

      if (!videoUploadUrl || !videoAccessKey)
        throw new Error("Failed to get video upload credentials");

      await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);

      const {
        uploadUrl: thumbnailUploadUrl,
        cdnUrl: thumbnailCdnUrl,
        accessKey: thumbnailAccessKey,
      } = await getThumbnailUploadUrl(videoId);

      if (!thumbnailUploadUrl || !thumbnailCdnUrl || !thumbnailAccessKey)
        throw new Error("Failed to get thumbnail upload credentials");

      await uploadFileToBunny(
        thumbnail.file,
        thumbnailUploadUrl,
        thumbnailAccessKey
      );

      await saveVideoDetails({
        videoId,
        thumbnailUrl: thumbnailCdnUrl,
        ...formData,
        duration: videoDuration,
      });

      router.push(`/video/${videoId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[95%] sm:max-w-lg"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
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
            {isSubmitting ? "Uploading..." : "Upload Video"}
          </Button>
        </form>
        {/*<Form {...form}>*/}
        {/*  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">*/}
        {/*    /!* Title *!/*/}
        {/*    <FormField*/}
        {/*      control={form.control}*/}
        {/*      name="title"*/}
        {/*      render={({ field }) => (*/}
        {/*        <FormItem className="flex flex-col">*/}
        {/*          <FormLabel>Title</FormLabel>*/}
        {/*          <FormControl>*/}
        {/*            <Input {...field} placeholder="Enter video title" />*/}
        {/*          </FormControl>*/}
        {/*          <FormMessage />*/}
        {/*        </FormItem>*/}
        {/*      )}*/}
        {/*    />*/}

        {/*    /!* Description *!/*/}
        {/*    <FormField*/}
        {/*      control={form.control}*/}
        {/*      name="description"*/}
        {/*      render={({ field }) => (*/}
        {/*        <FormItem className="flex flex-col">*/}
        {/*          <FormLabel>Description</FormLabel>*/}
        {/*          <FormControl>*/}
        {/*            <Textarea*/}
        {/*              {...field}*/}
        {/*              rows={2}*/}
        {/*              placeholder="Enter video description"*/}
        {/*              className={"break-words flex resize-none overflow-hidden"}*/}
        {/*            />*/}
        {/*          </FormControl>*/}
        {/*          <FormMessage />*/}
        {/*        </FormItem>*/}
        {/*      )}*/}
        {/*    />*/}

        {/*    /!* Upload Video *!/*/}
        {/*    <FormField*/}
        {/*      control={form.control}*/}
        {/*      name="video"*/}
        {/*      render={({ field }) => (*/}
        {/*        <FormItem className="flex flex-col">*/}
        {/*          <FormLabel>Upload Video</FormLabel>*/}
        {/*          <FormControl>*/}
        {/*            <Input*/}
        {/*              type="file"*/}
        {/*              accept="video/*"*/}
        {/*              onChange={(e) => field.onChange(e.target.files)}*/}
        {/*            />*/}
        {/*          </FormControl>*/}
        {/*          <FormMessage />*/}
        {/*        </FormItem>*/}
        {/*      )}*/}
        {/*    />*/}

        {/*    /!* Upload Thumbnail *!/*/}
        {/*    <FormField*/}
        {/*      control={form.control}*/}
        {/*      name="thumbnail"*/}
        {/*      render={({ field }) => (*/}
        {/*        <FormItem className="flex flex-col">*/}
        {/*          <FormLabel>Upload Thumbnail</FormLabel>*/}
        {/*          <FormControl>*/}
        {/*            <Input*/}
        {/*              type="file"*/}
        {/*              accept="image/*"*/}
        {/*              onChange={(e) => field.onChange(e.target.files)}*/}
        {/*            />*/}
        {/*          </FormControl>*/}
        {/*          <FormMessage />*/}
        {/*        </FormItem>*/}
        {/*      )}*/}
        {/*    />*/}

        {/*    /!* Visibility *!/*/}
        {/*    <FormField*/}
        {/*      control={form.control}*/}
        {/*      name="visibility"*/}
        {/*      render={({ field }) => (*/}
        {/*        <FormItem className="flex flex-col">*/}
        {/*          <FormLabel>Visibility</FormLabel>*/}
        {/*          <FormControl>*/}
        {/*            <Select onValueChange={field.onChange} defaultValue={field.value}>*/}
        {/*              <SelectTrigger>*/}
        {/*                <SelectValue placeholder="Select visibility" />*/}
        {/*              </SelectTrigger>*/}
        {/*              <SelectContent>*/}
        {/*                <SelectItem value="public">Public</SelectItem>*/}
        {/*                <SelectItem value="private">Private</SelectItem>*/}
        {/*              </SelectContent>*/}
        {/*            </Select>*/}
        {/*          </FormControl>*/}
        {/*          <FormMessage />*/}
        {/*        </FormItem>*/}
        {/*      )}*/}
        {/*    />*/}

        {/*    /!* Buttons *!/*/}
        {/*    <div className="flex w-full">*/}
        {/*      <Button type="submit" disabled={isLoading} className="w-full bg-lavender-500 text-white hover:bg-lavender-600 rounded-2xl">*/}
        {/*        {isLoading ? 'Uploading...' : 'Upload video'}*/}
        {/*      </Button>*/}
        {/*    </div>*/}
        {/*  </form>*/}
        {/*</Form>*/}
      </DialogContent>
    </Dialog>
  );
}
export default VideoUploadForms;
