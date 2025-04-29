
import React, { useState } from "react";
import { FormResponse, LoginData } from "@/types/form";
import LoginForm from "./LoginForm";
import DynamicForm from "./DynamicForm";
import { createUser, getFormStructure } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const FormContainer: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formStructure, setFormStructure] = useState<FormResponse | null>(null);
  const [userData, setUserData] = useState<LoginData | null>(null);
  const { toast } = useToast();

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      // Register the user
      await createUser(data);
      
      // Fetch the form structure
      const formData = await getFormStructure(data.rollNumber);
      
      // Update state
      setUserData(data);
      setFormStructure(formData);
      setIsLoggedIn(true);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.name}! Your dynamic form has been loaded.`,
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formStructure) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-form-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-form-blue" />
          <h2 className="text-xl font-medium mt-4">Loading your form...</h2>
          <p className="text-gray-500">Please wait while we prepare everything.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-form-background p-4">
      {!isLoggedIn ? (
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Student Form Portal</h1>
          <LoginForm onLogin={handleLogin} isLoading={isLoading} />
        </div>
      ) : formStructure ? (
        <DynamicForm formData={formStructure} />
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-medium">Something went wrong</h2>
          <p className="text-gray-500">Unable to load the form structure.</p>
          <button 
            className="mt-4 px-4 py-2 bg-form-blue text-white rounded hover:bg-form-blue-dark"
            onClick={() => setIsLoggedIn(false)}
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default FormContainer;
