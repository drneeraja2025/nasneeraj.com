/** Route saarthee.nasneeraj.com root to the Saarthee marketing page (not index.html). */
export default function middleware(request) {
  const host = (request.headers.get('host') || '').replace(/:\d+$/, '').toLowerCase();
  if (host !== 'saarthee.nasneeraj.com') {
    return;
  }

  const url = new URL(request.url);
  if (url.pathname === '/' || url.pathname === '/index.html') {
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
