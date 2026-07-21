import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export const useRecaptchaV3 = () => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim();

  useEffect(() => {
    if (siteKey) {
      const scriptId = 'recaptcha-v3-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, [siteKey]);

  const executeRecaptcha = async (action: string = 'submit'): Promise<string> => {
    if (!siteKey) {
      return 'bypass_token';
    }

    return new Promise<string>((resolve) => {
      if (window.grecaptcha && window.grecaptcha.execute) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action })
            .then((token: string) => {
              if (token && typeof token === 'string' && token.trim().length > 0) {
                resolve(token.trim());
              } else {
                console.warn('reCAPTCHA returned empty or null token, falling back to bypass_token');
                resolve('bypass_token');
              }
            })
            .catch((err: any) => {
              console.warn('reCAPTCHA execution failed:', err);
              resolve('bypass_token');
            });
        });
      } else {
        console.warn('window.grecaptcha not ready, falling back to bypass_token');
        resolve('bypass_token');
      }
    });
  };

  return { executeRecaptcha, hasRecaptcha: !!siteKey };
};
