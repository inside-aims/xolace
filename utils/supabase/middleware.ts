import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // List of protected routes
    const protectedRoutes = [
      "/feed",
      "/create-post",
      "/post",
      "/channel",
      "/profile",
    ];

    // List of public routes
    const publicRoutes = ["/", "/sign-in", "/sign-up"];

    // Check if the request path matches any public route
    const isPublicRoute = publicRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    // Check if the request path matches any protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    );

    // If user is not authenticated and trying to access a protected route, redirect to sign-in
    if (isProtectedRoute && user.error) {
      console.log(
        `Unauthenticated user attempting to access: ${request.nextUrl.pathname}`
      );
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Redirect authenticated user from home page to '/feed' (or any default page)
    if (isPublicRoute && !user.error) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
