import { RegistrationForm } from '../RegistrationForm';
import { OtpVerification } from '../OtpVerification';
import { SuccessScreen } from '../SuccessScreen';
import { FlowProgress } from '../FlowProgress';
import { usePortalContext } from '../../context/PortalContext';
import gdgLogo from '../../assets/images/gdg-logo.png';

export const RegistrationGateway = () => {
  const { currentState, setCurrentState, formData, setFormData } = usePortalContext();

  const handleRegistrationSuccess = (data: any) => {
    setFormData(data);
    setCurrentState('OTP_VERIFICATION');
  };

  const handleOtpSuccess = () => {
    setCurrentState('SUCCESS_SCREEN');
  };

  const handleOtpBack = () => {
    setCurrentState('REGISTRATION_FORM');
  };

  return (
    <section id="registration-terminal" className="scroll-mt-24 space-y-8 pt-16 pb-16 flex flex-col items-center">
      <div className="text-center space-y-3 flex flex-col items-center">
        <img src={gdgLogo} alt="GDG Logo" className="w-14 h-14 object-contain animate-pulse mb-1" />
        <h2 className="font-comic text-2xl md:text-4xl lg:text-5xl font-normal tracking-wide text-white uppercase">
          REGISTRATION GATEWAY
        </h2>
        <FlowProgress currentStep={currentState} className="mt-2" />
      </div>

      <div className="w-full flex justify-center mt-6">
        {currentState === 'REGISTRATION_FORM' && (
          <RegistrationForm onSuccess={handleRegistrationSuccess} />
        )}

        {currentState === 'OTP_VERIFICATION' && (
          <OtpVerification 
            email={formData?.email || ''} 
            formData={formData}
            onSuccess={handleOtpSuccess} 
            onBack={handleOtpBack}
          />
        )}

        {currentState === 'SUCCESS_SCREEN' && (
          <SuccessScreen formData={formData} />
        )}
      </div>
    </section>
  );
};
