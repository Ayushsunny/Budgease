import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { signInWithGoogle } from "@/firebase/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  children?: React.ReactNode;
  triggerClassName?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({ children, triggerClassName }) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      navigate("/dashboard");
      setOpen(false);
    } catch (error: any) {
      setError(error.message || "Sign-in failed. Please try again.");
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
    <Button className={triggerClassName} onClick={() => setOpen(true)}>
      {children || "Get Started"}
    </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to Budget Tracker</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleSignIn} className="w-full bg-black">
            Sign in with Google
          </Button>
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};