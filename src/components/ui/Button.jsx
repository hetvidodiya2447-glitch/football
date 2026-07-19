import React from 'react';

const variants = {
  primary: 'bg-primary-fixed text-black border border-black hover:brightness-110 shadow-md transition-all font-bold',
  secondary: 'bg-transparent border border-secondary text-secondary hover:bg-secondary/10 hover:shadow-[0_0_15px_rgba(220,184,255,0.4)] transition-all font-semibold',
  outline: 'bg-transparent border border-outline text-on-surface hover:border-primary-fixed hover:text-primary-fixed transition-all',
  ghost: 'text-on-surface hover:bg-surface-container-high transition-all',
  danger: 'bg-error text-black border border-black hover:brightness-110 transition-all font-bold',
};

const sizes = {
  sm: 'px-3 py-1.5 text-[10px] font-label-caps tracking-wider uppercase',
  md: 'px-5 py-2.5 text-xs font-label-caps tracking-wider uppercase',
  lg: 'px-8 py-3 text-sm font-label-caps tracking-wider uppercase font-semibold',
};

const Button = React.forwardRef(({ className = "", variant = "primary", size = "md", isLoading, children, "aria-label": ariaLabel, ...props }, ref) => {
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-fixed focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses} ${sizeClasses} ${className}`}
      disabled={isLoading || props.disabled}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
