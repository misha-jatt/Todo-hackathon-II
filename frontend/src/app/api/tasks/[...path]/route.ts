/* Tasks API proxy — forwards requests to FastAPI backend with gateway secret.

[From]: API gateway secret implementation
*/
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function proxyRequest(request: NextRequest) {
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}${url.pathname}${url.search}`;

  const headers = new Headers();
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) headers.set('cookie', cookieHeader);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  if (process.env.API_GATEWAY_SECRET) {
    headers.set('X-Gateway-Secret', process.env.API_GATEWAY_SECRET);
  }

  let body: string | null = null;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    try { body = await request.text(); } catch { body = null; }
  }

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: body || undefined,
    credentials: 'include',
  });

  const responseHeaders = new Headers();
  response.headers.forEach((value, key) => {
    if (!['transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  const responseBody = await response.arrayBuffer();
  return new NextResponse(responseBody, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest) { return proxyRequest(request); }
export async function POST(request: NextRequest) { return proxyRequest(request); }
export async function PUT(request: NextRequest) { return proxyRequest(request); }
export async function PATCH(request: NextRequest) { return proxyRequest(request); }
export async function DELETE(request: NextRequest) { return proxyRequest(request); }
