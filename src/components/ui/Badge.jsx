import React from 'react';

const variants = {
  success: 'bg-primary-fixed text-black border border-black font-bold',
  warning: 'bg-secondary text-black font-bold border border-black',
  error: 'bg-error text-black font-bold border border-black',
  info: 'bg-secondary-container text-on-secondary-container font-semibold',
  neutral: 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/30',
};

const Badge = React.forwardRef(({ className = "", variant = "neutral", children, ...props }, ref) => {
  const variantClasses = variants[variant] || variants.neutral;
  return (
    <span
      ref={ref}
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-label-caps tracking-wider uppercase ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
