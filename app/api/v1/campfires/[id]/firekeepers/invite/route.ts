import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const inviteSchema = z.object({
  inviteeId: z.string().uuid(),
  permissionIds: z.array(z.number()).min(1),
  invitationMessage: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: ClaimsData, error: ClaimsError } = await supabase.auth.getClaims();
    const user = ClaimsData?.claims?.sub;
    
    if (ClaimsError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { inviteeId, permissionIds, invitationMessage } = inviteSchema.parse(body)
    
    // Get current user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('supabase_user', user)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const campfireId = params.id;

    // Check for pending invitations
    const { data: pendingInvite, error: pendingError } = await supabase
      .from('campfire_moderator_invites')
      .select('id')
      .eq('campfire_id', campfireId)
      .eq('invitee_id', inviteeId)
      .is('accepted_at', null)
      .is('declined_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (pendingError) {
      console.error('Pending invite check error:', pendingError);
      return NextResponse.json(
        { error: 'Failed to check pending invitations' },
        { status: 500 }
      );
    }

    if (pendingInvite) {
      return NextResponse.json(
        { error: `This Camper already has a pending invitation` },
        { status: 400 }
      );
    }

    // Call the database function
    const { data, error } = await supabase.rpc('create_firekeeper_invitation', {
      p_campfire_id: campfireId,
      p_inviter_id: profile.id,
      p_invitee_id: inviteeId,
      p_permission_ids: permissionIds,
      p_invitation_message: invitationMessage
    })

    if (error) {
      console.error('Invitation creation error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ invitationId: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}