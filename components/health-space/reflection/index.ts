import { ImageProps } from "next/image";
import { ChangeEvent, ReactNode } from "react";

export const BUNNY = {
  STREAM_BASE_URL: "https://video.bunnycdn.com/library",
  STORAGE_BASE_URL: "https://storage.bunnycdn.com/sample-xolace",
  CDN_URL: "https://sample-xolacezone.b-cdn.net",
  TRANSCRIPT_URL: "https://vz-d7087565-e86.b-cdn.net",
  EMBED_URL: "https://iframe.mediadelivery.net/embed",
};


export const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
export const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;

export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  as?: "input" | "textarea" | "select";
  options?: Array<{ value: string; label: string }>;
}

export interface FileInputProps {
  id: string;
  label: string;
  accept: string;
  file: File | null;
  previewUrl: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  type: "video" | "image";
}

export interface TranscriptEntry {
  time: string;
  text: string;
}

export interface VideoFormValues {
  title: string;
  description: string;
  visibility: "public" | "private";
}

export interface SearchResult {
  video: {
    id: string;
    videoId: string;
    title: string;
    thumbnailUrl: string;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

export interface VideoCardProps {
  videoId: string;
  title: string;
  thumbnail: string;
  userImg: string;
  username: string;
  createdAt: Date;
  views: number;
  visibility: Visibility;
  duration: number | null;
}

export interface VideoDetailProps {
  title: string;
  createdAt: Date;
  userImg: string | null | undefined;
  username?: string;
  videoId: string;
  ownerId: string;
  views: number;
  duration: number | null;
  visibility: string;
  thumbnailUrl: string;
  description: string;
  category: string;
  totalWatchTime: number | null;
  captions: Caption[];
  averageWatchTime: number | null;
  hasMP4Fallback: boolean
  collectionId: string;
  jitEncodingEnabled: boolean
  metaTags: {property: string; value: string}[];
  moments: string[]
  transcodingMessages: TranscodingMessage[]
}

export interface Caption {
  time: string;
  text: string;
}
export interface TranscodingMessage {
  issueCode: number | null;
  level: number | null;
  message: string | null;
  timeStamp: string | null;
  value: string | null;
}

export interface VideoPlayerProps {
  videoId: string;
  className?: string;
}
export interface VideoInfoProps {
  transcript?: string;
  title: string;
  createdAt: Date;
  description: string;
  video_id: string;
  videoUrl: string;
}

export interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  fallback?: string;
  alt: string;
  src: string | null;
}

type Visibility = "public" | "private";

export interface VideoDetails {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  tags?: string | string[];
  visibility: Visibility;
  duration?: number | null;
}

export interface BunnyVideoResponse {
  guid: string;
  status: number;
  encodeProgress?: number;
}

export type ApiResponse<T> =
  | ({ success: true; error: null } & T)
  | { success: false; error: string };

export interface ApiFetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: object;
  expectJson?: boolean;
  bunnyType: "stream" | "storage";
}

export interface BunnyStreamApiOptions {
  method?: string;
  body?: object;
}

export interface VideoUploadUrlResponse {
  videoId: string;
  uploadUrl: string;
  accessKey: string;
}

export interface ThumbnailUploadUrlResponse {
  uploadUrl: string;
  cdnUrl: string;
  accessKey: string;
}

export interface VideoProcessingStatus {
  isProcessed: boolean;
  encodingProgress: number;
  status: number;
}

export interface VideoWithUserResult {
  video: {
    id: string;
    videoId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    userId: string;
    views: number;
    tags?: string[];
    visibility: Visibility;
    createdAt: Date;
    updatedAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface VideoObject {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  userId: string;
  views: number;
  tags?: string[];
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithVideos {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  };
  videos: VideoObject[];
  count: number;
}

export interface ExtendedMediaStream extends MediaStream {
  _originalStreams?: MediaStream[];
}

export interface SharedHeaderProps {
  subHeader: string;
  title: string;
  userImg?: string;
}

export interface SharedHeaderProps {
  subHeader: string;
  title: string;
  userImg?: string;
}

export interface Params {
  params: Promise<Record<string, string>>;
}

export interface SearchParams {
  searchParams: Promise<Record<string, string | undefined>>;
}

export interface ParamsWithSearch {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | undefined>>;
}

export interface DropdownListProps {
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
  triggerElement: ReactNode;
}

export interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export interface MediaStreams {
  displayStream: MediaStream;
  micStream: MediaStream | null;
  hasDisplayAudio: boolean;
}

export interface BunnyRecordingState {
  isRecording: boolean;
  recordedBlob: Blob | null;
  recordedVideoUrl: string;
  recordingDuration: number;
}

export interface ExtendedMediaStream extends MediaStream {
  _originalStreams?: MediaStream[];
}

// Types
interface VideoQueryResult {
  video: typeof videos.$inferSelect;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number | unknown;
  };
}

export interface RecordingHandlers {
  onDataAvailable: (e: BlobEvent) => void;
  onStop: () => void;
}
