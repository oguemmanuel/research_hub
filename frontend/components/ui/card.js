import React from 'react';

// Card Component with additional styling and variant options
export function Card({ children, className, variant = "default", padding = "p-4", ...props }) {
  const variants = {
    default: 'border rounded-lg shadow p-4',
    outline: 'border-2 border-gray-300 rounded-lg p-4',
    shadow: 'border rounded-lg shadow-xl p-4',
    flat: 'border-none p-4',
  };

  const cardClasses = `${variants[variant] || variants.default} ${padding} ${className}`;

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}

// CardHeader for card's top section
export function CardHeader({ children, className }) {
  return <div className={`border-b pb-2 mb-2 ${className}`}>{children}</div>;
}

// CardTitle for the title of the card
export function CardTitle({ children, className }) {
  return <h3 className={`text-lg font-bold ${className}`}>{children}</h3>;
}

// CardContent for the main content of the card
export function CardContent({ children, className }) {
  return <div className={`text-sm ${className}`}>{children}</div>;
}

// CardFooter for the bottom section of the card, can be used for buttons/links
export function CardFooter({ children, className }) {
  return <div className={`pt-2 mt-2 ${className}`}>{children}</div>;
}

// Button Component for reusable buttons
export function Button({ variant, size, className, children, ...props }) {
  const baseStyles = 'rounded border px-4 py-2 font-medium';
  const variants = {
    outline: 'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100',
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  };
  const sizes = {
    sm: 'text-sm py-1 px-2',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };
  const styles = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || 'text-base py-2 px-4'} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}

// Usage Example
const Example = () => {
  return (
    <Card variant="shadow" padding="p-6" className="max-w-sm mx-auto md:max-w-md lg:max-w-lg">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        This is the content of the card.
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="md">Click Me</Button>
      </CardFooter>
    </Card>
  );
}

export default Example;
