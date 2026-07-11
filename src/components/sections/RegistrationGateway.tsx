import { RegistrationForm } from '../RegistrationForm';
import { OtpVerification } from '../OtpVerification';
import { SuccessScreen } from '../SuccessScreen';
import { usePortalContext } from '../../context/PortalContext';
import { motion, AnimatePresence } from 'framer-motion';
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
      
      {/* Header reveal */}
      <motion.div 
        className="text-center space-y-3 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className='flex justify-center items-center'>
          <img src={gdgLogo} alt="GDG Logo" className="w-14 h-14 object-contain animate-pulse mb-1" />
          <span className='font-poppins-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase select-none tracking-tight text-shadow-glow'>GDG</span>
        </div>
        
        <h2 className="title-spiderman text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase select-none tracking-tight text-shadow-glow">
          REGISTRATION GATEWAY
        </h2>
      </motion.div>
      
      {/* Slide transitions between forms */}
      <div className="w-full flex justify-center mt-6 min-h-[750px] md:min-h-[600px] transition-all duration-300">
        <AnimatePresence mode="wait">
          {currentState === 'REGISTRATION_FORM' && (
            <motion.div
              key="registration-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <RegistrationForm onSuccess={handleRegistrationSuccess} />
            </motion.div>
          )}

          {currentState === 'OTP_VERIFICATION' && (
            <motion.div
              key="otp-verification"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <OtpVerification 
                email={formData?.email || ''} 
                formData={formData}
                onSuccess={handleOtpSuccess} 
                onBack={handleOtpBack}
              />
            </motion.div>
          )}

          {currentState === 'SUCCESS_SCREEN' && (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <SuccessScreen formData={formData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
