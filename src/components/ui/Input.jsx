import React from 'react';

const Input = React.forwardRef(({ className = "", icon: Icon, error, id, ...props }, ref) => {
  const errorId = id ? `${id}-error` : undefined;
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-outline" aria-hidden="true" />
        </div>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`w-full bg-surface-container-low text-on-surface border rounded-lg py-2 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all placeholder-outline-variant/50 font-body-md
          ${Icon ? 'pl-10 pr-4' : 'px-4'}
          ${error ? 'border-error focus:ring-error' : 'border-outline-variant/30'}
          ${className}
        `}
        {...props}
      />
      {error && <p id={errorId} className="mt-1 text-sm text-error" role="alert">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
