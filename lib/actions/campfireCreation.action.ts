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

// Join a campfire
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

// Leave a campfire
export async function leaveCampfire(
  campfireId: string,
  userId: string,
): Promise<void> {
  const supabase = await createClient();
  try {

    // Check if member exists and get role
    const { data: member, error: memberError } = await supabase
      .from('campfire_members')
      .select('role')
      .eq('campfire_id', campfireId)
      .eq('user_id', userId)
      .single();

    if (memberError || !member) {
      throw new Error('You are not a member of this campfire');
    }

    // Prevent creator from leaving (they should transfer ownership first)
    if (member.role === 'firestarter') {
      throw new Error('Firestarters cannot leave their campfire. Transfer ownership first.');
      };

    const { error } = await supabase
        .from('campfire_members')
        .delete()
        .eq('campfire_id', campfireId)
        .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to leave campfire: ${error.message}`);
    }
  } catch (error) {
    console.error('Error leaving campfire:', error);
    throw error;
  }
}

// Add campfire to favorites (auto-join if not already a member)
export async function addCampfireToFavorites(
  campfireId: string,
  userId: string,
): Promise<void> {
  const supabase = await createClient();
  
  try {
    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from('campfire_members')
      .select('id, is_favorite')
      .eq('campfire_id', campfireId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected if not a member
      throw new Error(`Failed to check membership: ${checkError.message}`);
    }

    if (existingMember) {
      // User is already a member, just update is_favorite to true
      const { error: updateError } = await supabase
        .from('campfire_members')
        .update({ is_favorite: true })
        .eq('id', existingMember.id);

      if (updateError) {
        throw new Error(`Failed to favorite campfire: ${updateError.message}`);
      }
    } else {
      // User is not a member, join them with is_favorite = true
      const { error: insertError } = await supabase
        .from('campfire_members')
        .insert({
          campfire_id: campfireId,
          user_id: userId,
          is_favorite: true,
        });

      if (insertError) {
        throw new Error(`Failed to join and favorite campfire: ${insertError.message}`);
      }
    }
  } catch (error) {
    console.error('Error adding campfire to favorites:', error);
    throw error;
  }
}

// Remove campfire from favorites (keep membership)
export async function removeCampfireFromFavorites(
  campfireId: string,
  userId: string,
): Promise<void> {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase
      .from('campfire_members')
      .update({ is_favorite: false })
      .eq('campfire_id', campfireId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to unfavorite campfire: ${error.message}`);
    }
  } catch (error) {
    console.error('Error removing campfire from favorites:', error);
    throw error;
  }
}
