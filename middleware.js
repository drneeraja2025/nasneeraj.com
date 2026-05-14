/** Saarthee subdomain routing: root = marketing page; index.html = main NAS home. */
export default function middleware(request) {
  const host = (request.headers.get('host') || '').replace(/:\d+$/, '').toLowerCase();
  if (host !== 'saarthee.nasneeraj.com') {
    return;
  }

  const url = new URL(request.url);

  if (url.pathname === '/index.html') {
    return Response.redirect('https://nasneeraj.com/', 302);
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
  matcher: ['/', '/index.html'],
};
