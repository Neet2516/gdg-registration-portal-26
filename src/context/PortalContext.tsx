import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { RegistrationData } from '../components/RegistrationForm';

type FormState = 'CAPTCHA_GATE' | 'REGISTRATION_FORM' | 'OTP_VERIFICATION' | 'SUCCESS_SCREEN';

interface PortalContextType {
  currentState: FormState;
  setCurrentState: (state: FormState) => void;
  formData: RegistrationData | null;
  setFormData: (data: RegistrationData | null) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentState, setCurrentState] = useState<FormState>('CAPTCHA_GATE');
  const [formData, setFormData] = useState<RegistrationData | null>(null);

  return (
    <PortalContext.Provider value={{ currentState, setCurrentState, formData, setFormData }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortalContext = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortalContext must be used within a PortalProvider');
  }
  return context;
};
