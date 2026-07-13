import { RegistrationForm } from '../RegistrationForm';
import { OtpVerification } from '../OtpVerification';
import { SuccessScreen } from '../SuccessScreen';
import { usePortalContext } from '../../context/PortalContext';
import { motion, AnimatePresence } from 'framer-motion';
import gdgLogo from '../../assets/images/gdg-logo.png';

export const RegistrationGateway = () => {
  const { currentState, setCurrentState, formData, setFormData } = usePortalContext();

  const titleWords = "REGISTRATION GATEWAY".split(" ");
  const wordContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  const letterVar: any = {
    hidden: { opacity: 0, y: 15, filter: "blur(6px)", scale: 1.3 },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 }
    }
  };

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
      <div className="text-center space-y-3 flex flex-col items-center mb-10 relative z-10 w-full">
        
        
        {/* 3D Animated Title Reveal */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-x-4 relative z-10"
          variants={wordContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {titleWords.map((word, wIdx) => (
            <span key={wIdx} className="flex overflow-hidden py-1">
              {Array.from(word).map((char, cIdx) => (
                <motion.span 
                  key={cIdx} 
                  className="title-spiderman text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase select-none tracking-tight text-shadow-glow"
                  variants={letterVar}
                  style={{
                    textShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
      
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
