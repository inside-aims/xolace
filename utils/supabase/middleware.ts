import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  console.log(process.env.ROOT_DOMAIN)
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
      {
        cookieOptions:{
          ...(process.env.NODE_ENV === 'production' && { domain: `.${process.env.ROOT_DOMAIN}` }),
        },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // cookiesToSet.forEach(({ name, value }) =>
            //   request.cookies.set(name, value),
            // );
            // response = NextResponse.next({
            //   request,
            // });
            cookiesToSet.forEach(({ name, value, options }) =>{
              // const newOptions = {
              //   ...options, // Spread original options first
              //   domain: '.xolace.app', // FORCE the domain
              //   path: '/',
              //   secure: true,
              //   sameSite: 'lax' as const,
              // };

              response.cookies.set(name, value, options)
            });
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    // const user = await supabase.auth.getUser();
    // Do not run code between createServerClient and
    // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: If you remove getClaims() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    // List of protected routes
    const protectedRoutes = [
      '/feed',
      '/create-post',
      '/post',
      '/channel',
      '/profile',
      '/change-password',
      '/settings',
      '/activities',
      '/collections',
      '/explore',
      '/health-tips',
      '/create-health-tips',
      '/glimpse',
      '/notifications',
    ];

    // List of public routes
    const publicRoutes = ['/', '/sign-in', '/sign-up'];

    // Check if the request path matches any public route
    const isPublicRoute = publicRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route),
    );

    // Check if the request path matches any protected route
    const isProtectedRoute = protectedRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route),
    );

    // If user is not authenticated and trying to access a protected route, redirect to sign-in
    if (isProtectedRoute && !user) {
      // add a nexturl search params of the protected route so we can redirect when we sign in
      return NextResponse.redirect(
        new URL('/sign-in?nexturl=' + request.nextUrl.pathname, request.url),
      );
    }

    // Redirect authenticated user from home page to '/feed' (or any default page)
    if (
      (request.nextUrl.pathname === '/' ||
        request.nextUrl.pathname === '/sign-in' ||
        request.nextUrl.pathname === '/sign-up') &&
      user
    ) {
      return NextResponse.redirect(new URL('/feed', request.url));
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
