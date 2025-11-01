import { motion } from 'framer-motion';
import { useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // Reduce animation duration to 2.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        },
      }}
    >
      <div className="relative">
        {/* Background blur effect */}
        <motion.div
          className="absolute inset-0 blur-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 0.7, 1],
            scale: [0.5, 1.5, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.33, 0.66, 1],
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
        </motion.div>

        {/* AJ Logo */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotateX: -90 }}
          animate={{
            scale: [0, 1.2, 1],
            rotateX: [-90, 0, 0],
            rotateY: [0, 180, 0],
          }}
          transition={{
            duration: 2,
            ease: [0.76, 0, 0.24, 1],
            times: [0, 0.5, 1],
          }}
        >
          <motion.h1
            className="text-[8rem] font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
            animate={{
              textShadow: [
                '0 0 20px rgba(59, 130, 246, 0.5)', // blue-500
                '0 0 60px rgba(59, 130, 246, 0.8)',
                '0 0 20px rgba(59, 130, 246, 0.5)',
              ],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            BB
          </motion.h1>
        </motion.div>

        {/* Particles with alternating colors */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              i % 2 === 0 ? 'bg-blue-400' : 'bg-cyan-400'
            }`}
            initial={{
              opacity: 0,
              x: 0,
              y: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 150],
              y: [0, (Math.random() - 0.5) * 150],
              scale: [0, Math.random() * 1.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SplashScreen;
