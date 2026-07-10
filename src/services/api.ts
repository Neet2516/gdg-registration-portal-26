const getBackendUrl = () => {
  return import.meta.env.VITE_BACKEND_URL || 'https://proximety-7nt5.vercel.app/api/v1';
};

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
  domain: string;
  githubId: string;
  hackerrankId: string;
}

export const sendOtp = async (payload: SendOtpPayload) => {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'FAILED TO INIT OTP SESSION. RETRY.');
  }
  return data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'INVALID VERIFICATION KEY. ACCESS DENIED.');
  }
  return data;
};

export const registerStudent = async (payload: RegisterPayload) => {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'REGISTRATION FAILED. TRY RESENDING OTP.');
  }
  return data;
};
