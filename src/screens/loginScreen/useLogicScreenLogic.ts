import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Errors {
  username?: string;
  password?: string;
  email?: string;
}

export const useLoginScreenLogic = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validateForm = (): Errors => {
    const errors: Errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!isLogin && !email.trim()) {
      errors.email = "Email is required";
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (isLogin) {
        const response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setApiError(errorData.message || "Invalid username or password");
          return;
        }

        const { token, isAdmin } = await response.json();
        localStorage.setItem("isAdmin", isAdmin ? "admin" : "");
        localStorage.setItem("token", token);
        localStorage.setItem("logged_user", username);
        navigate("/shop");
      } else {
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            email,
            isAdmin: false,
            permissions: ["read"],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to create account");
          return;
        }
        const { token, isAdmin } = await response.json();
        localStorage.setItem("isAdmin", isAdmin ? "admin" : "");
        localStorage.setItem("token", token);
        localStorage.setItem("logged_user", username);
        navigate("/shop");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      setApiError("An error occurred. Please try again later.");
    }
  };

  return {
    isLogin,
    setIsLogin,
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    errors,
    apiError,
    handleSubmit,
  };
};
