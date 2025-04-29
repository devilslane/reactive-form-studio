
import { FormResponse, LoginData } from "../types/form";

const API_BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const createUser = async (userData: LoginData): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error("An unknown error occurred");
  }
};

export const getFormStructure = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-form?rollNumber=${rollNumber}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch form data");
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch form: ${error.message}`);
    }
    throw new Error("An unknown error occurred");
  }
};
