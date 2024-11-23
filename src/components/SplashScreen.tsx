import { motion } from 'framer-motion';

const SplashScreen = ({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) => {
  return (
    <motion.div
      className="flex -mt-20 justify-center items-center h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: 1.1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 1.5,
        ease: 'easeInOut',
      }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.img
        src="/logo.png"
        alt="Gym App Logo"
        initial={{ scale: 0.5, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 1 }}
        className="w-48 h-auto"
      />
    </motion.div>
  );
};

export default SplashScreen;