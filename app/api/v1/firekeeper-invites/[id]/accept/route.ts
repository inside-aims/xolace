import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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
  
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('supabase_user', user)
        .single()
  
      if (profileError || !profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      }
  
      const { data, error } = await supabase.rpc('accept_firekeeper_invitation', {
        p_invitation_id: params.id,
        p_user_id: profile.id
      })
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
  
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('API Error:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }