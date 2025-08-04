import Link from 'next/link';
import { ErrorAlert } from '../shared/xolace-alert';
import { Button } from '../ui/button';

const InviteError = () => {
  return (
    <div className="dark:bg-bg-dark bg-bg text-foreground flex min-h-screen w-full flex-col items-center justify-center gap-3 px-2 md:px-0">
      <ErrorAlert
        title="Invite Error"
        description="Invite code is invalid or expired. If this is a mistake, please contact support."
        supportingText="xolace25@gmail.com"
      />
      <Link href="/sign-in" replace>
        <Button className="bg-lavender-500 hover:bg-lavender-600 text-white">
          Back to login
        </Button>
      </Link>
    </div>
  );
};

export default InviteError;
