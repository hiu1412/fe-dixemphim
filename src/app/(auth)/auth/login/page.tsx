"use client"

import { GoogleButton } from "@/components/auth/GoogleButton";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export default function LoginPage(){
    const [error, setError] = useState<string | null >(null);


    return (
        <div className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
    
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
    
          <LoginForm />
    
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-muted-foreground text-sm">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>
          </div>
          <GoogleButton />

        </div>
      );
    }
