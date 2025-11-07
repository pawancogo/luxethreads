/**
 * Reusable Form Field Component
 * Wraps input with validation display
 * Follows DRY principle
 */

import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select';
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  className?: string;
  inputClassName?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required,
  disabled,
  options,
  className,
  inputClassName,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(newValue);
  };

  const handleSelectChange = (newValue: string) => {
    onChange(newValue);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name} className={required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
          {label}
        </Label>
      )}
      
      {type === 'textarea' ? (
        <Textarea
          id={name}
          value={value || ''}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(error && 'border-red-500', inputClassName)}
        />
      ) : type === 'select' ? (
        <Select
          value={value || ''}
          onValueChange={handleSelectChange}
          disabled={disabled}
        >
          <SelectTrigger className={cn(error && 'border-red-500', inputClassName)}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          type={type}
          value={value || ''}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn(error && 'border-red-500', inputClassName)}
        />
      )}
      
      {error && (
        <FormMessage>{error}</FormMessage>
      )}
    </div>
  );
};

