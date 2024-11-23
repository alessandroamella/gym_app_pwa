import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FC } from 'react';

interface LoadingSpinnerProps {
  message?: string;
}
const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  message = 'Loading workouts...',
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const spinTransition = {
    repeat: Infinity,
    ease: 'linear',
    duration: 1,
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-8, 0, -8],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.3 },
    animate: {
      scale: 1.2,
      opacity: 0,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[200px] space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="relative">
        <motion.div
          className="absolute inset-0 w-12 h-12 rounded-full border-4 border-primary/30"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={spinTransition}
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center space-y-4"
        variants={itemVariants}
      >
        <motion.p
          className="text-lg font-medium text-primary"
          variants={itemVariants}
        >
          {message}
        </motion.p>

        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-primary/60"
              variants={dotVariants}
              initial="initial"
              animate="animate"
              transition={{
                delay: index * 0.15,
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
