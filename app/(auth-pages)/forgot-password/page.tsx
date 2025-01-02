import { FormMessage, Message } from "@/components/shared/form-message";
import { SubmitButton } from "@/components/extras/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { urlPath } from "@/utils/url-helpers";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-[100vh] flex justify-center items-center overflow-hidden">
      <div className="max-sm:w-full md:w-[40%]  md:px-12">
        <form
          className=" flex flex-col w-full gap-2 text-foreground [&>input]:mb-6  mx-auto  text-center max-sm:p-2"
          method="POST"
          action={urlPath("/api/v1/auth/magic-link")}
        >
          <div>
            <h1 className="text-2xl font-medium">Reset Password</h1>
            <p className="text-sm text-secondary-foreground">
              Already have an account?{" "}
              <Link className="text-primary underline" href="/sign-in">
                Sign in
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
            <input type="hidden" name="type" value="recovery" />
            <Label htmlFor="email" className="text-start">
              Email
            </Label>
            <Input name="email" placeholder="you@example.com" required />
            <SubmitButton>Reset Password</SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  );
}
