'use server';

import { createClient } from '@/utils/supabase/server';
import { uploadImageToBucket } from '@/utils/helpers/uploadImageToBucket';
import { CampfireRule } from '@/components/campfires/campfires.types';
import { generateCampfireSlug } from '../utils';

export const createCampfire = async (formData: FormData) => {
  const supabase = await createClient();
  const supabase_user_id: string | null =
    (await supabase.auth.getClaims()).data?.claims?.sub ?? null;

  if (!supabase_user_id) {
    return { success: false, message: 'User not authenticated' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const purpose = formData.get('purpose') as string;
  const visibility = formData.get('visibility') as string;
  const rulesString = formData.get('rules') as string;
  const rules = JSON.parse(rulesString) as CampfireRule[];
  const iconBlob = formData.get('icon') as File | null;
  const bannerBlob = formData.get('banner') as File | null;
  const slug = formData.get('slug') as string;

  let iconUrl: string | undefined;
  let bannerUrl: string | undefined;

  if (iconBlob) {
    const { success, path, message } = await uploadImageToBucket({
      file: iconBlob,
      bucketName: 'campfires.bucket',
      supabase: supabase,
      folder: 'icons',
      owner: supabase_user_id,
      bucketType: 'public',
    });
    if (success) {
      iconUrl = path as string;
    } else {
      return { success: false, message: `Icon upload failed: ${message}` };
    }
  }

  if (bannerBlob) {
    const { success, path, message } = await uploadImageToBucket({
      file: bannerBlob,
      bucketName: 'campfires.bucket',
      supabase: supabase,
      folder: 'banners',
      owner: supabase_user_id,
      bucketType: 'public',
    });
    if (success) {
      bannerUrl = path as string;
    } else {
      return { success: false, message: `Banner upload failed: ${message}` };
    }
  }

  const { data: campfire, error } = await supabase
    .from('campfires')
    .insert({
      name,
      slug,
      description,
      purpose,
      visibility,
      icon_url: iconUrl,
      banner_url: bannerUrl,
    })
    .select()
    .single();

  if (error) {
    console.log(error);
    return { success: false, message: error.message };
  }

  if (campfire && rules.length > 0) {
    const rulesToInsert = rules.map(rule => ({
      campfire_id: campfire.id,
      title: rule.title,
      description: rule.description,
      display_order: rule.display_order,
    }));

    const { error: rulesError } = await supabase
      .from('campfire_rules')
      .insert(rulesToInsert);

    if (rulesError) {
      console.log(rulesError);
      // Optionally, you might want to delete the created campfire if rules insertion fails
      // await supabase.from('campfires').delete().match({ id: campfire.id });
      return {
        success: false,
        message: `Campfire created, but failed to add rules: ${rulesError.message}`,
      };
    }
  }

  console.log('Campfire ', campfire);
  return { success: true, data: campfire };
};

export async function joinCampfire(
  campfireId: string,
  userId: string,
): Promise<void> {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from('campfire_members').insert({
      campfire_id: campfireId,
      user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to join campfire: ${error.message}`);
    }
  } catch (error) {
    console.error('Error joining campfire:', error);
    throw error;
  }
}
