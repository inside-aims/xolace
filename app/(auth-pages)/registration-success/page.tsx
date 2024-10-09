import { urlPath } from "@/utils/url-helpers";
import Link from "next/link";

export default function RegistrationSuccessPage({ searchParams }: any) {
  const { email } = searchParams;

  return (
    <div className=" text-center pt-10 min-h-[80vh]">
      <h1>Registration succeeded!</h1>
      <p>Check your email ({email}) for a link to activate your account.</p>

      <br />
      <Link role="button" href={urlPath("/sign-in")}>
        Login
      </Link>
    </div>
  );
}
