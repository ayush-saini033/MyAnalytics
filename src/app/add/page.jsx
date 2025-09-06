"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Globe,
  AlertCircle,
  Check,
  Code,
  Sparkles,
  Zap,
  Copy,
} from "lucide-react";
import { supabase } from "@/config/Subpabase.Client";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function MyAnalyticsDomainInput() {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedDomains, setAddedDomains] = useState([]); // store domain + script
  const [particles, setParticles] = useState([]);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  const user = useUser();

  // ✅ Floating particles
  useEffect(() => {
    const generated = Array.from({ length: 6 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${i * 0.5}s`,
      duration: `${3 + i}s`,
    }));
    setParticles(generated);
  }, []);

  const validateDomain = (input) => {
    const raw = input.trim();

    if (!raw) {
      setError("Domain cannot be empty");
      setIsValid(false);
      return false;
    }

    if (
      /^https?:\/\//i.test(raw) ||
      raw.includes("/") ||
      raw.includes(":") ||
      raw.includes("?") ||
      raw.includes("#")
    ) {
      setError("Please enter only the domain (e.g., example.com)");
      setIsValid(false);
      return false;
    }

    const cleanDomain = raw.replace(/^www\./, "");
    const domainRegex =
      /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))+$/;

    if (!domainRegex.test(cleanDomain)) {
      setError("Please enter a valid domain (e.g., example.com)");
      setIsValid(false);
      return false;
    }

    if (cleanDomain.length < 4 || cleanDomain.length > 255) {
      setError("Domain must be between 4 and 255 characters");
      setIsValid(false);
      return false;
    }

    if (!cleanDomain.includes(".")) {
      setError("Please enter a complete domain with extension");
      setIsValid(false);
      return false;
    }

    if (addedDomains.find((d) => d.domain === cleanDomain)) {
      setError("This domain has already been added");
      setIsValid(false);
      return false;
    }

    setError("");
    setIsValid(true);
    return cleanDomain;
  };

  const generateScript = (domain) => {
    return `
    <script defer data-domain="${domain}" src="${process.env.NEXT_PUBLIC_APP_URI}/tracking-script.js"></script>
    `;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setDomain(value);
    validateDomain(value);
  };

  const handleAddWebsite = async () => {
    setIsLoading(true);
    const cleanDomain = validateDomain(domain);
    if (!cleanDomain) {
      setIsLoading(false);
      return;
    }

    const { data: websites } = await supabase.from("websites").select("*");
    if (websites?.find((item) => item.website_name === cleanDomain)) {
      setError("This domain is added before");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from("websites")
      .insert([{ website_name: cleanDomain, user_id: user.id }])
      .select();

    setIsLoading(false);

    if (!error) {
      const script = generateScript(cleanDomain);
      setAddedDomains([{ domain: cleanDomain, script }]);
      setDomain("");
    }
  };

  const copyScript = (script) => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-white relative">
      {/* Background */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-900 rounded-3xl mb-6 shadow-2xl border border-gray-600/30 relative">
              <Globe className="w-10 h-10 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-3 tracking-tight">
              MyAnalytics
            </h1>
            <p className="text-gray-400 text-base md:text-xl font-light max-w-2xl mx-auto">
              Transform your website data into actionable insights
            </p>
          </div>

          {/* Show input until domain added */}
          {addedDomains.length === 0 ? (
            <div className="max-w-xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-6">
                  <Zap className="w-6 h-6 text-gray-300" />
                  <h2 className="text-xl md:text-2xl font-semibold">
                    Add Your Website
                  </h2>
                </div>

                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Website Domain
                </label>
                <div className="relative group mb-4">
                  <input
                    type="text"
                    value={domain}
                    onChange={handleInputChange}
                    placeholder="yourawesome-site.com"
                    className={`w-full px-4 md:px-6 py-3 md:py-5 bg-gray-800/90 border-2 rounded-2xl text-white placeholder-gray-500 transition-all duration-500 focus:outline-none ${
                      error
                        ? "border-red-500/60 focus:border-red-400"
                        : isValid
                        ? "border-emerald-500/60 focus:border-emerald-400"
                        : "border-gray-600/60 focus:border-gray-500/80"
                    }`}
                  />
                  {isValid && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center text-red-400 text-sm bg-red-500/10 rounded-xl p-3 border border-red-500/20 mb-4">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleAddWebsite}
                  disabled={!isValid || isLoading}
                  className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 text-base md:text-lg ${
                    isValid && !isLoading
                      ? "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-500 hover:to-gray-600 text-white shadow-md hover:shadow-xl"
                      : "bg-gray-800/60 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating Script...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add Website</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Generated Script Section */}
              <div className="bg-gray-800/20 rounded-3xl p-6 sm:p-8 border border-gray-600/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Your Tracking Script
                  </h3>
                  <button
                    onClick={() => copyScript(addedDomains[0].script)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700/80 hover:bg-gray-600/80 rounded-md text-sm"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <pre className="text-gray-300 p-6 rounded-2xl bg-gray-800/20 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {addedDomains[0].script}
                </pre>

                <p className="mt-4 flex items-center justify-center text-gray-500 text-sm">
                  Paste this snippet in the <b>&nbsp;head&nbsp;</b> of your
                  website
                </p>
              </div>

              {/* Active Domains */}
              <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-7 border border-gray-700/40 shadow-lg shadow-black/30">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 tracking-wide mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Domain
                </h3>

                <div
                  className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800/70 rounded-xl p-4 border border-gray-700/40 cursor-pointer transform transition-all duration-300 hover:scale-[1.03] hover:shadow-md hover:shadow-emerald-500/20"
                  onClick={() =>
                    router.push(`/w/${addedDomains[0].domain.trim()}`)
                  }
                >
                  <span className="text-gray-200 font-medium truncate">
                    {addedDomains[0].domain}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-500/20">
                    Live
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
