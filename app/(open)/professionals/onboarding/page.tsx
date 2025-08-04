import ProfessionalsOnboarding from "@/components/professionals/onboarding";
import InviteError from "@/components/professionals/inviteError";
import { createClient } from '@/utils/supabase/server';

const OnboardingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {

  const inviteCode = (await searchParams).invite;

  if (inviteCode === undefined) {
    return <InviteError />;
  }

  const supabase = await createClient();

  // check code from professionals_invite_codes table to see if inviteCode is present in the table and expired is false , it should only check when inviteCode is defined 
  const { data: inviteCodeData } = await supabase
    .from('professionals_invite_codes')
    .select('*')
    .eq('code', inviteCode)
    .single();

  return (
    <main>
      {inviteCodeData && inviteCodeData.expired === false ? <ProfessionalsOnboarding/> : <InviteError/>}
    </main>
  );
};

export default OnboardingPage;
