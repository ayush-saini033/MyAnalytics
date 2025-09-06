"use client";

import { supabase } from "@/config/Subpabase.Client";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

const SignInPage = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        // or /auth/callback if you handle callback separately
      },
    });

    if (error) {
      console.error("Google Sign-In Error:", error.message);
    } else {
      console.log("Google Sign-In Clicked");
    }
  };


  const catchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(user)
    if (user) {
      if (user.role === "authenticated") router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (!supabase) return;
    catchUser();
  }, [supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="flex flex-col items-center w-full max-w-md p-10 bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-800">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide">
          Welcome Back
        </h1>
        <p className="text-gray-400 mb-10 text-center">
          Sign in to access your dashboard and manage your websites.
        </p>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full gap-3 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-all duration-300 shadow-lg"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full my-8">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* Footer Text */}
        <div className="text-gray-500 text-sm text-center">
          By signing in, you agree to our{" "}
          <span className="text-cyan-400 hover:text-white underline cursor-pointer transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-cyan-400 hover:text-white underline cursor-pointer transition-colors">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
