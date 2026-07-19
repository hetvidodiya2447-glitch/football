import React from 'react';

const Card = React.forwardRef(({ className = "", children, hoverable = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`glass-card rounded-xl p-6 ${hoverable ? 'hover:border-primary-fixed/30 hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
