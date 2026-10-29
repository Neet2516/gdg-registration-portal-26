const ALLOWED_ENDPOINTS = new Set(['', 'send-otp', 'verify-otp', 'register']);
const ALLOWED_METHODS = {
  '': ['GET', 'HEAD'],
  'send-otp': ['POST'],
  'verify-otp': ['POST'],
  'register': ['POST'],
};

const readRequestBody = async (req) => {
  if (req.body == null) {
    return undefined;
  }

  if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
    return req.body;
  }

  return JSON.stringify(req.body);
};

export default async function handler(req, res) {
  const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL)?.trim();

  if (!backendUrl) {
    res.status(500).json({
      success: false,
      message: 'BACKEND_URL is not configured on the server.',
    });
    return;
  }

  const endpoint = ''; // Base path is always empty endpoint

  const method = req.method?.toUpperCase() ?? 'GET';
  const allowedMethods = ALLOWED_METHODS[endpoint] ?? [];

  if (!allowedMethods.includes(method)) {
    res.setHeader('Allow', allowedMethods.join(', '));
    res.status(405).json({
      success: false,
      message: 'Method not allowed for this route.',
    });
    return;
  }

  const upstreamBase = backendUrl.replace(/\/+$/, '');
  const upstreamUrl = upstreamBase;

  const upstreamHeaders = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) {
      continue;
    }

    const lowerKey = key.toLowerCase();
    if ([
      'host',
      'connection',
      'content-length',
      'cdn-loop',
      'cf-ray',
      'cf-connecting-ip',
      'cf-visitor',
      'cf-ew-via',
      'cf-worker',
      'x-vercel-id',
      'x-vercel-cache',
      'x-forwarded-proto',
      'x-forwarded-host',
    ].includes(lowerKey)) {
      continue;
    }

    upstreamHeaders.set(key, Array.isArray(value) ? value.join(', ') : value);
  }

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method,
      headers: upstreamHeaders,
      body: method === 'GET' || method === 'HEAD' ? undefined : await readRequestBody(req),
    });

    res.status(upstreamResponse.status);

    upstreamResponse.headers.forEach((value, key) => {
      if (['content-encoding', 'transfer-encoding', 'content-length'].includes(key.toLowerCase())) {
        return;
      }

      res.setHeader(key, value);
    });

    const responseBody = Buffer.from(await upstreamResponse.arrayBuffer());
    res.send(responseBody);
  } catch (error) {
    console.error('Secure gateway proxy failed:', error);
    res.status(502).json({
      success: false,
      message: 'Secure gateway could not reach the backend service.',
    });
  }
}
