import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
interface AnimatedButtonProps {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  to,
  onClick,
  children,
  variant = 'primary',
  className = '',
  type = 'button'
}) => {
  // Button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800';
      case 'secondary':
        return 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800';
      case 'outline':
        return 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50';
      default:
        return 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800';
    }
  };
  const buttonClasses = `px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md ${getButtonStyles()} ${className}`;
  // Render either a Link or a button
  if (to) {
    return <motion.div whileHover={{
      scale: 1.05
    }} whileTap={{
      scale: 0.95
    }} transition={{
      type: 'spring',
      stiffness: 400,
      damping: 17
    }}>
        <Link to={to} className={buttonClasses}>
          {children}
        </Link>
      </motion.div>;
  }
  return <motion.button type={type} onClick={onClick} className={buttonClasses} whileHover={{
    scale: 1.05
  }} whileTap={{
    scale: 0.95
  }} transition={{
    type: 'spring',
    stiffness: 400,
    damping: 17
  }}>
      {children}
    </motion.button>;
};