
import React from "react";
import { FormField, FormData } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DynamicFieldProps {
  field: FormField;
  value: string | string[] | boolean;
  onChange: (id: string, value: string | string[] | boolean) => void;
  error?: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({ field, value, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
    if (typeof e === "string") {
      onChange(field.fieldId, e);
    } else {
      const target = e.target;
      if (target.type === "checkbox") {
        onChange(field.fieldId, (target as HTMLInputElement).checked);
      } else {
        onChange(field.fieldId, target.value);
      }
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(field.fieldId, checked);
  };

  const handleMultiCheckboxChange = (optionValue: string, checked: boolean) => {
    let values = (value as string[]) || [];
    if (checked) {
      values = [...values, optionValue];
    } else {
      values = values.filter((v) => v !== optionValue);
    }
    onChange(field.fieldId, values);
  };

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "tel":
      case "email":
        return (
          <Input
            type={field.type}
            id={field.fieldId}
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={value as string}
            onChange={handleChange}
            className={cn(error ? "border-destructive" : "")}
            maxLength={field.maxLength}
            data-test-id={field.dataTestId}
            required={field.required}
          />
        );
      case "textarea":
        return (
          <Textarea
            id={field.fieldId}
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={value as string}
            onChange={handleChange}
            className={cn(error ? "border-destructive" : "")}
            maxLength={field.maxLength}
            data-test-id={field.dataTestId}
            required={field.required}
          />
        );
      case "date":
        return (
          <Input
            type="date"
            id={field.fieldId}
            value={value as string}
            onChange={handleChange}
            className={cn(error ? "border-destructive" : "")}
            data-test-id={field.dataTestId}
            required={field.required}
          />
        );
      case "dropdown":
        return (
          <Select
            value={value as string}
            onValueChange={(val) => handleChange(val)}
            data-test-id={field.dataTestId}
          >
            <SelectTrigger className={cn(error ? "border-destructive" : "")}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-test-id={option.dataTestId}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(val) => handleChange(val)}
            className="flex flex-col space-y-1"
            data-test-id={field.dataTestId}
          >
            {field.options?.map((option) => (
              <div className="flex items-center space-x-2" key={option.value}>
                <RadioGroupItem 
                  value={option.value} 
                  id={`${field.fieldId}-${option.value}`} 
                  data-test-id={option.dataTestId}
                />
                <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case "checkbox":
        if (field.options && field.options.length > 0) {
          // Multiple checkboxes
          return (
            <div className="flex flex-col space-y-2">
              {field.options.map((option) => {
                const isChecked = Array.isArray(value) 
                  ? value.includes(option.value) 
                  : false;
                
                return (
                  <div className="flex items-center space-x-2" key={option.value}>
                    <Checkbox
                      id={`${field.fieldId}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => 
                        handleMultiCheckboxChange(option.value, checked === true)
                      }
                      data-test-id={option.dataTestId}
                    />
                    <Label htmlFor={`${field.fieldId}-${option.value}`}>{option.label}</Label>
                  </div>
                );
              })}
            </div>
          );
        }
        // Single checkbox
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.fieldId}
              checked={Boolean(value)}
              onCheckedChange={handleCheckboxChange}
              data-test-id={field.dataTestId}
            />
            <Label htmlFor={field.fieldId}>{field.label}</Label>
          </div>
        );
      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="space-y-2">
      {field.type !== "checkbox" && (
        <div className="flex items-baseline justify-between">
          <Label htmlFor={field.fieldId}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
        </div>
      )}
      {renderField()}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default DynamicField;
