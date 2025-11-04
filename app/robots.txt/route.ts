// app/robots/route.ts
export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://pgagates.com/sitemap.xml
Host: https://pgagates.com
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}

