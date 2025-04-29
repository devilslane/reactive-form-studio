
import React from "react";
import { FormSection as FormSectionType, FormData, FormField } from "@/types/form";
import DynamicField from "./DynamicField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface FormSectionProps {
  section: FormSectionType;
  formData: FormData;
  onChange: (fieldId: string, value: string | string[] | boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  errors: Record<string, string>;
  totalSections: number;
  currentSectionIndex: number;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  formData,
  onChange,
  onNext,
  onPrev,
  isFirst,
  isLast,
  errors,
  totalSections,
  currentSectionIndex
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
          <div className="text-sm font-medium">
            Section {currentSectionIndex + 1} of {totalSections}
          </div>
        </div>
        <CardDescription>{section.description}</CardDescription>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
          <div
            className="bg-form-blue h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {section.fields.map((field) => (
          <DynamicField
            key={field.fieldId}
            field={field}
            value={formData[field.fieldId] || (field.type === "checkbox" && field.options ? [] : "")}
            onChange={onChange}
            error={errors[field.fieldId]}
          />
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={isFirst}
          className={`${isFirst ? 'invisible' : ''}`}
          data-test-id="prev-button"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="bg-form-blue hover:bg-form-blue-dark"
          data-test-id={isLast ? "submit-button" : "next-button"}
        >
          {isLast ? (
            <>
              Submit
              <Check className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FormSection;
