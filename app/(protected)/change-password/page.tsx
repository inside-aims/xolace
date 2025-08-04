import type { Metadata } from 'next';

import ChangePassword from './ChangePassword';

export const metadata: Metadata = {
  title: 'Change Password',
}

export default async function ChangePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {

  const from = (await searchParams).from;
  return (
    <ChangePassword from={from}/>
  );
}
