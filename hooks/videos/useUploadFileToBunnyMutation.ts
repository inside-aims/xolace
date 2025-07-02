import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';


// Define an interface for the data passed to the mutation
interface UploadFileParams {
    file: File;
    uploadUrl: string;
    accessKey: string;
  }

const uploadFileToBunny = async (
    file: File,
    uploadUrl: string,
    accessKey: string
  ): Promise<void> =>{
    await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          AccessKey: accessKey,
        },
        body: file,
      })
  }
    


  export function useUploadFileToBunnyMutation() {
    const uploadMutation = useMutation({
      mutationFn: async ({ file, uploadUrl, accessKey }: UploadFileParams) => {
        await uploadFileToBunny(file, uploadUrl, accessKey);
      },
      onSuccess: () => {
        console.log('Upload file to Bunny succeeded.');
      },
      onError: (error) => {
        console.error('Upload file to Bunny failed:', error);
        // It's often better to let the calling function handle the toast
        // so the error message is more specific to the context (e.g., "Thumbnail upload failed").
        toast.error('A file upload failed. Please try again.');
      },
    });
  
    return {
      // Export the async version
      uploadFileToBunnyAsync: uploadMutation.mutateAsync,
      isLoading: uploadMutation.isPending,
    };
  }
