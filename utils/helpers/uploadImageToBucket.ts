import { SupabaseClient } from "@supabase/supabase-js";

export const uploadImageToBucket = async ({file, bucketName, supabase, selectedFile, folder, owner, bucketType }: {file: File | string | undefined, bucketName: string, supabase: SupabaseClient, selectedFile: File | null, folder: string | undefined, owner: string | undefined, bucketType: "private" | "public" | undefined}) => {
    if (file && selectedFile) {
        let filePath;
        if(typeof file === 'string') {
            const fileName = `${owner}_${selectedFile.name}`;
            if(folder){
                filePath = `${folder}/${fileName}`;
            }else{
                filePath = fileName;
            }
        } else {
            const fileName = `${owner}_${file.name}`;
            if(folder){
                filePath = `${folder}/${fileName}`;
            }else{
                filePath = fileName;
            }
        }
  
        try {
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, selectedFile, {
              cacheControl: "3600",
              upsert: false,
              metadata: {
                owner: owner
              }
            });
  
          if (uploadError) {
            console.error("Error uploading image:", uploadError);
        
                return {success: false, path: null, message: `Image upload failed: ${uploadError.message}`}
        
          }
  
        if(bucketType === "public") {
            const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
            return {success: true, path: urlData.publicUrl, message: 'Upload successful'};
        }
  
          return {success: true, path: filePath, message: 'Upload successful'};
        } catch (storageError: any) {
          console.error("Storage operation failed:", storageError);
          return {success: false, path: null, message: `Storage operation failed: ${storageError.message}`};
        }
      }
      return {success: false, path: null, message: 'No file provided'};
}