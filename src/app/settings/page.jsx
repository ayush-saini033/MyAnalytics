"use client";

import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../_components/header";
import { supabase } from "@/config/Subpabase.Client";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy, Check } from "lucide-react";
const SettingsPage = () => {
  const user = useUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Give time to fetch user
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingUser(false);
    }, 800); // ⏳ wait ~0.8s before deciding

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loadingUser && user === null) {
      router.push("/signin");
    }
  }, [user, router, loadingUser]);

  const generateApiKey = async () => {
    if (!user || isLoading) return;

    setIsLoading(true);

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36);

      const { data, error } = await supabase
        .from("users")
        .insert([{ api: randomString, user_id: user.id }])
        .select();

    if (error) {
      console.log(error);
    } else {
      setApiKey(randomString);
    }

    setIsLoading(false);
  };

  const getUserAPIs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("user_id", user.id);
    if (data.length > 0) {
      setApiKey(data[0].api);
    }
    setIsLoading(false);
  };

    useEffect(() => {
      if (!supabase || !user) return;
      getUserAPIs();
    }, [user, supabase]);

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (loadingUser || user === null) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-gray-400">
              {loadingUser ? "Loading..." : "Redirecting..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">API Settings</h1>
          <p className="text-gray-400">
            Generate and manage your API key for custom integrations
          </p>
        </div>

        {!apiKey && !isLoading && (
          <div className="text-center mb-8">
            <button
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              onClick={generateApiKey}
            >
              Generate API Key
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-gray-400">Generating API Key...</span>
            </div>
          </div>
        )}

        {apiKey && (
          <div className="space-y-8">
            {/* API Key Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Your API Key
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                      type="text"
                      value={apiKey}
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={copyApiKey}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    {copySuccess ? "✓ Copied!" : "Copy API Key"}
                  </button>
                </div>
              </div>
            </div>

            {/* Documentation Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gray-800 px-8 py-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  API Usage Example
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Use this code snippet to create custom events with your API
                  key
                </p>
              </div>

              <div className="p-0">
                <CodeComp apiKey={apiKey} />
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gray-900 border border-yellow-800 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-yellow-500 font-medium">
                    Security Notice
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Keep your API key secure and never expose it in client-side
                    code. Store it safely in your server environment variables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

const CodeComp = ({ apiKey }) => {

      const [copied, setCopied] = useState(false);

  const codeString = `const url = "${process.env.NEXT_PUBLIC_APP_URI}/api/events";
const headers = {
  "Content-Type": "application/json",
  "Authorization": "Bearer ${apiKey || "{{your_api_key}}"}",
};

const eventData = {
  name: "user_signup",        // * required
  domain: "example.com",      // * required  
  description: "New user registered", // optional
};

const sendRequest = async () => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(eventData)
    });
    
    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the function
sendRequest();`;

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // reset after 2s
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};


  return (
    <div className="relative rounded-xl overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 transition text-sm"
      >
        {copied ? (
          <>
            <Check size={16} className="text-green-400" /> Copied
          </>
        ) : (
          <>
            <Copy size={16} /> Copy
          </>
        )}
      </button>
      <SyntaxHighlighter
        language="javascript"
        style={atomOneDark}
        customStyle={{
          margin: 0,
          padding: "24px",
          background: "#0d1117",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          color: "#6e7681",
          paddingRight: "16px",
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};
