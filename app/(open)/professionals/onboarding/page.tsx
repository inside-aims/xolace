import ProfessionalsOnboarding from "@/components/professionals/onboarding";
import InviteError from "@/components/professionals/inviteError";

const OnboardingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {

  const inviteCode = (await searchParams).invite;

  return (
    <main>
      {inviteCode ? <ProfessionalsOnboarding/> : <InviteError/>}
    </main>
  );
};

export default OnboardingPage;
