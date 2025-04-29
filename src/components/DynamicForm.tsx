
import React, { useState, useEffect } from "react";
import { FormSection as FormSectionType, FormResponse, FormData, FormField } from "@/types/form";
import FormSection from "./FormSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DynamicFormProps {
  formData: FormResponse;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formData }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const currentSection = formData.form.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === formData.form.sections.length - 1;
  
  const validateField = (field: FormField, value: string | string[] | boolean): string => {
    if (field.required && (value === "" || (Array.isArray(value) && value.length === 0))) {
      return field.validation?.message || "This field is required";
    }
    
    if (typeof value === "string") {
      if (field.minLength && value.length < field.minLength) {
        return `Must be at least ${field.minLength} characters`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        return `Cannot exceed ${field.maxLength} characters`;
      }
      
      if (field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
      }
      
      if (field.type === "tel") {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          return "Please enter a valid 10-digit phone number";
        }
      }
    }
    
    return "";
  };
  
  const validateSection = (section: FormSectionType): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    section.fields.forEach((field) => {
      const value = formValues[field.fieldId] || "";
      const error = validateField(field, value);
      if (error) {
        newErrors[field.fieldId] = error;
      }
    });
    
    return newErrors;
  };
  
  const handleFieldChange = (fieldId: string, value: string | string[] | boolean) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    
    // Clear error for this field if it exists
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };
  
  const handleNext = () => {
    const sectionErrors = validateSection(currentSection);
    
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      
      toast({
        title: "Validation Error",
        description: "Please fix the highlighted fields before continuing.",
        variant: "destructive",
      });
      
      return;
    }
    
    if (isLastSection) {
      // Submit the form
      console.log("Form submitted with values:", formValues);
      
      toast({
        title: "Form Submitted",
        description: "Your form has been successfully submitted!",
      });
      
      return;
    }
    
    // Move to next section
    setCurrentSectionIndex((prev) => prev + 1);
  };
  
  const handlePrev = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{formData.form.formTitle}</h1>
        
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Please fix the validation errors before proceeding.
            </AlertDescription>
          </Alert>
        )}
        
        <FormSection
          section={currentSection}
          formData={formValues}
          onChange={handleFieldChange}
          onNext={handleNext}
          onPrev={handlePrev}
          isFirst={isFirstSection}
          isLast={isLastSection}
          errors={errors}
          totalSections={formData.form.sections.length}
          currentSectionIndex={currentSectionIndex}
        />
      </div>
    </div>
  );
};

export default DynamicForm;
