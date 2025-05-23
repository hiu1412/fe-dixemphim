"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormField({ label, error, className, ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Input
        className={cn(
          "w-full",
          error && "border-red-500 focus-visible:ring-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}