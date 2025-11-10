import Link from 'next/link';

const XolaceLinks = ({ className }: { className?: string }) => {
  return (
    <div className={`flex-1 max-sm:hidden ${className}`}>
      <div className="flex h-full flex-col justify-end">
        <div className="flex flex-wrap justify-center gap-2 p-2 text-xs text-slate-600/60 dark:text-slate-400/60">
          <span>
            <Link className="hover:text-slate-200 hover:underline" href="#">
              Xolace Rules
            </Link>
          </span>
          <span>
            <Link
              className="hover:text-slate-200 hover:underline"
              href="/policies"
            >
              Privacy Policy
            </Link>
          </span>
          <span>
            <Link
              className="hover:text-slate-200 hover:underline"
              href="/policy"
            >
              User Agreement
            </Link>
          </span>
          <span>
            <Link className="hover:text-slate-200 hover:underline" href="#">
              Xolace, Inc. © 2025. All rights reserved.
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default XolaceLinks;
