import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

// Supabase client setup and cookies manipulation
export const getSupabaseReqResClient = ({
  request,
}: {
  request: NextRequest;
}) => {
  // Basically copies of the existing headers from the request and proceeds.
  // we use the value property so supabase client can modify the response object later
  let response = {
    value: NextResponse.next({ request: request }),
  };

  //   Supabase server client initialisation
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // This function will be used to get all cookies from the request
        getAll() {
          return request.cookies.getAll();
        },
        // This function will be used to set all cookies to the request
        // To allow un-processed files such as a page , gain access to the cookies
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          //   Passing the new request cookies to the response object
          response.value = NextResponse.next({ request });

          //   setting the cookies to the response object
          cookiesToSet.forEach(({ name, value, options }) => {
            response.value.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
};
