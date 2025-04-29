
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoginData } from "@/types/form";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (data: LoginData) => Promise<void>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const { toast } = useToast();

  const onSubmit = async (data: LoginData) => {
    try {
      await onLogin(data);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Student Login</CardTitle>
        <CardDescription className="text-center">
          Enter your roll number and name to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rollNumber">Roll Number</Label>
            <Input
              id="rollNumber"
              placeholder="Enter your roll number"
              {...register("rollNumber", {
                required: "Roll number is required",
              })}
              className={errors.rollNumber ? "border-destructive" : ""}
              data-test-id="roll-number-input"
            />
            {errors.rollNumber && (
              <p className="text-sm text-destructive">{errors.rollNumber.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              {...register("name", {
                required: "Name is required",
              })}
              className={errors.name ? "border-destructive" : ""}
              data-test-id="name-input"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-form-blue hover:bg-form-blue-dark" 
            disabled={isLoading}
            data-test-id="login-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
