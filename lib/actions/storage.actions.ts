// lib/actions/storage.actions.ts

'use server';

import { createClient } from '@/utils/supabase/server';

/**
 * Gets multiple signed URLs from a private bucket in a single batch request.
 * @param paths - An array of file paths within the bucket.
 * @returns A promise that resolves to a record mapping each path to its signed URL.
 */
export async function getBatchSignedUrls(
  paths: string[],
): Promise<Record<string, string>> {

  const supabase = await createClient();

  // Return early if there's nothing to process
  if (!paths || paths.length === 0) {
    return {};
  }

  // Create an array of promises for each signed URL request
  const signedUrlPromises = paths.map(path =>
    supabase.storage.from('professionals.bucket').createSignedUrl(path, 3600), // 1 hour validity
  );

  try {
    // Wait for all promises to resolve concurrently
    const results = await Promise.all(signedUrlPromises);

    // Create a map of { path: signedUrl }
    const urlMap = results.reduce(
      (acc, result, index) => {
        if (!result.error && result.data) {
          acc[paths[index]] = result.data.signedUrl;
        } else {
          // You could log the error if a specific URL fails
          console.error(
            `Failed to get signed URL for ${paths[index]}:`,
            result.error,
          );
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    return urlMap;
  } catch (error) {
    console.error('Batch signed URL generation failed:', error);
    return {};
  }
}