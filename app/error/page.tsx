import { urlPath } from '@/utils/url-helpers';
import Link from 'next/link';
import Alert from '@/components/shared/xolace-alert';
import { ArrowLeft, Mail } from 'lucide-react';

// Error configuration with enhanced UX messaging
const errorConfig = {
  'login-failed': {
    variant: 'error' as const,
    title: 'Login Failed',
    description: 'We couldn\'t sign you in with those credentials.',
    supportingText: 'Double-check your email and password, then try again',
    actionText: 'Back to Sign In',
    showRefresh: true,
  },
  'invalid_magiclink': {
    variant: 'warning' as const,
    title: 'Magic Link Expired',
    description: 'This magic link is no longer valid or has expired. If the 10 mins have not elapsed, then please try signing in',
    supportingText: 'Magic links expire after 10 minutes for security. Some mail providers prefetch links, which can cause this error.',
    actionText: 'Request New Link / Sign In',
    showRefresh: false,
  },
  'magiclink': {
    variant: 'error' as const,
    title: 'Could Not Send Magic Link',
    description: 'We had trouble sending your magic link.',
    supportingText: 'Please verify your email address and try again',
    actionText: 'Back to Sign In',
    showRefresh: true,
  },
  'recovery': {
    variant: 'error' as const,
    title: 'Password Reset Failed',
    description: 'We couldn\'t process your password reset request.',
    supportingText: 'Please verify your email address is correct',
    actionText: 'Try Again',
    showRefresh: true,
  },
  'register_mail_mismatch': {
    variant: 'warning' as const,
    title: 'Registration Not Authorized',
    description: 'You\'re not authorized to register with this email address.',
    supportingText: 'Contact your administrator if you believe this is an error',
    actionText: 'Back to Sign Up',
    showRefresh: false,
  },
  'register_mail_exists': {
    variant: 'info' as const,
    title: 'Account Already Exists',
    description: 'An account with this email address is already registered.',
    supportingText: 'Try signing in instead, or use password recovery if needed',
    actionText: 'Go to Sign In',
    showRefresh: false,
  },
  'register_unknown': {
    variant: 'error' as const,
    title: 'Registration Failed',
    description: 'An unexpected error occurred during account creation.',
    supportingText: 'Our team has been notified and will investigate',
    actionText: 'Back to Sign Up',
    showRefresh: true,
  },
};

export default async function ErrorPage(props: {
  searchParams: Promise<{ type: string; email?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { type, email } = searchParams;

  const knownRegistrationErrors = [
    'register_mail_mismatch',
    'register_mail_exists',
    'register_unknown',
  ];

  // const knownErrors = [
  //   'login-failed',
  //   'invalid_magiclink',
  //   'magiclink',
  //   'recovery',
  //   ...knownRegistrationErrors,
  // ];

  const backLink = knownRegistrationErrors.includes(type)
    ? urlPath('/sign-up')
    : urlPath('/sign-in');

  // Get error configuration or fallback
  const config = errorConfig[type as keyof typeof errorConfig] || {
    variant: 'error' as const,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred.',
    supportingText: 'Please try again or contact support if the issue persists',
    actionText: 'Go Back',
    showRefresh: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-bg-dark dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Error Alert */}
        <Alert
          variant={config.variant}
          size="lg"
          title={config.title}
          description={config.description}
          supportingText={config.supportingText}
          className="shadow-lg"
        >
          {/* Email display for relevant errors */}
          {email && (type === 'register_mail_mismatch' || type === 'register_mail_exists') && (
            <div className="mt-3 p-3 bg-white/50 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 opacity-60" />
                <span className="font-medium">{email}</span>
              </div>
            </div>
          )}
        </Alert>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary Action */}
          <Link
            href={backLink}
            className="flex items-center justify-center gap-2 w-full bg-ocean-500 hover:bg-ocean-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            {config.actionText}
          </Link>

          {/* Secondary Actions */}
          <div className="flex gap-3">
            {/* Refresh/Retry Button */}
            {/* {config.showRefresh && (
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            )} */}

            {/* Help/Support Button */}
            {/* <Link
              href="/support"
              className="flex items-center justify-center gap-2 flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Link> */}
          </div>
        </div>

        {/* Additional Context for Specific Errors */}
        {/* {type === 'invalid_magiclink' && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Need help with magic links?
            </p>
            <Link
              href="/help/magic-links"
              className="text-sm text-ocean-600 hover:text-ocean-700 underline font-medium"
            >
              Learn more about secure authentication
            </Link>
          </div>
        )} */}

        {type === 'register_mail_mismatch' && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Need access to register?
            </p>
            <Link
              href="/contact"
              className="text-sm text-ocean-600 hover:text-ocean-700 underline font-medium"
            >
              Contact your administrator
            </Link>
          </div>
        )}

        {(type === 'register_mail_exists') && (
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Forgot your password?
            </p>
            <Link
              href="/forgot-password"
              className="text-sm text-ocean-600 hover:text-ocean-700 underline font-medium"
            >
              Reset your password here
            </Link>
          </div>
        )}

        {/* Error Code for Debugging (only in development or for support) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-500 font-mono">
              Error Code: {type}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}