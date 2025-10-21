import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

/**
 * Common Button Component with shadcn
 * @param {string} variant - 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
 * @param {string} size - 'default' | 'sm' | 'lg' | 'icon'
 * @param {boolean} loading - Show loading state
 * @param {ReactNode} icon - Icon to display before text
 * @param {string} className - Additional custom classes
 * @param {ReactNode} children - Button content
 * @param {object} ...props - All other button props
 */
const CommonBtn = ({
  variant = "default",
  size = "default",
  loading = false,
  icon,
  className = "",
  children,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={`relative bg-main hover:bg-main/90 text-darkColor rounded-[16px] ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {children}
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </Button>
  );
};

export default CommonBtn;
