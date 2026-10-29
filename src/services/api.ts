const API_BASE_PATH = '/api/v1';

export interface SendOtpPayload {
  name: string;
  email: string;
  studentNumber: string;
  captchaToken: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface RegisterPayload {
  name: string;
  studentNumber: string;
  email: string;
  gender: string;
  branch: string;
  phone: string;
  unstopId?: string;
  residence: string;
  domain?: string;
  githubId?: string;
  hackerrankId?: string;
}

const buildApiUrl = (path = '') => `${API_BASE_PATH}${path}`;
let backendConnectionPromise: Promise<boolean> | null = null;

const parseJsonResponse = async (response: Response) => {
  const text = await response.text();

  if (response.status === 405) {
    throw new Error('ROUTING ERROR (405): Method Not Allowed. The request was intercepted by a static page rewrite. Check vercel.json configuration.');
  }

  if (!response.ok && response.status === 500 && text.includes('BACKEND_URL')) {
    throw new Error('CONFIGURATION ERROR (500): BACKEND_URL environment variable is missing on the secure gateway.');
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    if (text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html')) {
      throw new Error('Connection interrupted by security gateway. Please refresh and try again.');
    }
    throw new Error('INVALID RESPONSE RECEIVED FROM SECURE GATEWAY.');
  }
};

const fetchWithRetry = async (url: string, options: RequestInit): Promise<Response> => {
  let response = await fetch(url, options);
  if (response.status === 502 || response.status === 504) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    try {
      response = await fetch(url, options);
    } catch {
      // Keep original response on retry failure
    }
  }
  return response;
};

export const sendOtp = async (payload: SendOtpPayload) => {
  const response = await fetchWithRetry(buildApiUrl('/send-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'FAILED TO INIT OTP SESSION. RETRY.');
  }
  return data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const response = await fetchWithRetry(buildApiUrl('/verify-otp'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'INVALID VERIFICATION KEY. ACCESS DENIED.');
  }
  return data;
};

export const registerStudent = async (payload: RegisterPayload) => {
  const response = await fetchWithRetry(buildApiUrl('/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonResponse(response);
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'REGISTRATION FAILED. TRY RESENDING OTP.');
  }
  return data;
};

export const checkBackendConnection = async (): Promise<boolean> => {
  if (!backendConnectionPromise) {
    backendConnectionPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout
        const response = await fetch(buildApiUrl(), {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        // Any response from the backend indicates connection is active
        return response.status >= 200 && response.status < 500;
      } catch (error) {
        console.warn('Backend connection check failed:', error);
        return false;
      }
    })();
  }

  return backendConnectionPromise;
};
