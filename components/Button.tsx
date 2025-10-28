import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'fill';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'default', ...props }) => {
  // Common classes for a refined brutalist look with subtle transitions
  const baseClasses = `
    uppercase px-6 py-3 text-base font-sans font-normal border-2 border-accent-black
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-accent-black
    active:shadow-none active:translate-x-0 active:translate-y-0
    transition-all duration-100
  `;

  if (variant === 'fill') {
    return (
      <button
        className={`
          ${baseClasses}
          bg-accent-black text-off-white
          hover:shadow-brutalist hover:-translate-x-1 hover:-translate-y-1
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Default button: "Border Extrude" effect for secondary/destructive actions.
  return (
    <button
      className={`
        ${baseClasses}
        bg-off-white text-off-black
        hover:border-5
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;