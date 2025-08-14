import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-white hover:shadow-lg transform hover:scale-105 focus:ring-primary/50",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-400",
    accent: "bg-gradient-to-r from-accent to-yellow-500 text-white hover:shadow-lg transform hover:scale-105 focus:ring-accent/50",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/5",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed transform-none",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className={cn("animate-spin", iconSizes[size], children && "mr-2")} />
      )}
      {icon && iconPosition === "left" && !loading && (
        <ApperIcon name={icon} className={cn(iconSizes[size], children && "mr-2")} />
      )}
      {children}
      {icon && iconPosition === "right" && !loading && (
        <ApperIcon name={icon} className={cn(iconSizes[size], children && "ml-2")} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;