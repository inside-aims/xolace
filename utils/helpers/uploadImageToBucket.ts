import { SupabaseClient } from '@supabase/supabase-js';

export function toFile(
  input: File | Blob,
  filename: string,
  type?: string,
): File {
  // If it's already a File, just return it
  if (input instanceof File) return input;

  // If it's a Blob, wrap it in a File object
  return new File([input], filename, { type: type || input.type });
}

export const uploadImageToBucket = async ({
  file,
  bucketName,
  supabase,
  selectedFile,
  folder,
  owner,
  bucketType,
}: {
  file: File | Blob | string | undefined | null;
  bucketName: string;
  supabase: SupabaseClient;
  selectedFile?: File | null;
  folder?: string;
  owner?: string;
  bucketType?: 'private' | 'public';
}) => {
  const fileToUpload =
    selectedFile ||
    (file instanceof File ? file : file instanceof Blob ? file : null);

  if (!fileToUpload) {
    return { success: false, path: null, message: 'No file provided' };
  }

  // Give a name if it’s just a Blob
  const safeFileName =
    file instanceof File ? file.name : `upload_${Date.now()}`;

  const fileName = `${owner || 'unowned'}_${safeFileName}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
        ...(owner && { metadata: { owner } }),
      });

    if (uploadError) {
      return {
        success: false,
        path: null,
        message: `Image upload failed: ${uploadError.message}`,
      };
    }

    if (bucketType === 'public') {
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      return {
        success: true,
        path: urlData.publicUrl,
        message: 'Upload successful',
      };
    }

    return { success: true, path: filePath, message: 'Upload successful' };
  } catch (storageError: any) {
    console.error('Storage operation failed:', storageError);
    return {
      success: false,
      path: null,
      message: `Storage operation failed: ${storageError.message}`,
    };
  }
};
