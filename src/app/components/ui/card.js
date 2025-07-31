// src/app/components/ui/card.js
export function Card({ children, className = "" }) {
    return (
      <div
        className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${className}`}
      >
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`p-6 flex flex-col items-center text-center gap-4 ${className}`}>{children}</div>;
  }
  