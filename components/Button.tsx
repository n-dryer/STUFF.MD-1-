import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses = "text-xs font-bold uppercase tracking-widest whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-50";

  const variants = {
    primary: 'px-4 py-2 bg-slate-900 text-white dark:bg-slate-50 dark:text-black hover:bg-slate-700 dark:hover:bg-slate-300',
    secondary: 'px-4 py-2 border-2 border-slate-900 dark:border-slate-50 hover:bg-slate-100 dark:hover:bg-slate-900',
    ghost: 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-50',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;