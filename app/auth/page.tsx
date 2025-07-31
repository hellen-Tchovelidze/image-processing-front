"use client";

import React, { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ImageIcon } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <ImageIcon className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold gradient-text">ImageFlow</h1>
          </div>
          <p className="text-muted-foreground">
            Professional image processing service
          </p>
        </div>

        {isLogin ? (
          <LoginForm onToggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
