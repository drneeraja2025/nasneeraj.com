/** Saarthee subdomain: marketing at / ; app auth paths → saarthee-coplanner.vercel.app */
const APP_ORIGIN = 'https://saarthee-coplanner.vercel.app';

export default function middleware(request) {
  const host = (request.headers.get('host') || '').replace(/:\d+$/, '').toLowerCase();
  if (host !== 'saarthee.nasneeraj.com') {
    return;
  }

  const url = new URL(request.url);

  if (url.pathname === '/index.html') {
    return Response.redirect('https://nasneeraj.com/', 302);
  }

  if (
    url.pathname === '/sign-in' ||
    url.pathname.startsWith('/sign-in/') ||
    url.pathname === '/sign-up' ||
    url.pathname.startsWith('/sign-up/') ||
    url.pathname.startsWith('/legal/') ||
    url.pathname === '/help' ||
    url.pathname.startsWith('/help/')
  ) {
    return Response.redirect(`${APP_ORIGIN}${url.pathname}${url.search}`, 302);
  }

  if (url.pathname === '/') {
    return new Response(null, {
      headers: {
        'x-middleware-rewrite': new URL('/saarthee.html', url).toString(),
      },
    });
  }
}

export const config = {
  matcher: ['/', '/index.html', '/sign-in', '/sign-in/:path*', '/sign-up', '/sign-up/:path*', '/legal/:path*', '/help', '/help/:path*'],
};
