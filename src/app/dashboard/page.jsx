"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Header from "../_components/header";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiGlobe,
  FiBarChart2,
  FiFolder,
  FiExternalLink,
  FiEye,
} from "react-icons/fi"; // ✅ Feather icons
import { supabase } from "@/config/Subpabase.Client";

const DashboardPage = () => {
  const user = useUser();
  const router = useRouter();

  const [websites, setWebsites] = useState([]);

  console.log(user);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user?.id) return; // wait until user is available

    const fetchWebsites = async () => {
      try {
        const { data, error } = await supabase
          .from("websites")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWebsites(data || []);
      } catch (err) {
        console.error("Error fetching websites:", err);
      }
    };

    fetchWebsites();
  }, [user?.id, supabase]); // dependencies

  return (
    <div className="bg-black min-h-screen w-full text-white relative overflow-hidden">
      {/* Global Header */}
      <Header />

      {/* Dashboard Header */}
      <section className="relative flex justify-between items-center px-8 py-8 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="space-y-2">
          <h1 className="text-4xl font-light tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm font-light">
            Manage your websites and view analytics
          </p>
        </div>
        <Link href="/add">
          <button className="group px-8 py-3 cursor-pointer bg-white text-black font-medium rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95 border border-gray-800/20">
            <span className="flex items-center gap-2">
              <FiPlus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Website
            </span>
          </button>
        </Link>
      </section>

      {/* Stats Overview */}
      <section className="relative px-8 py-6 border-b border-gray-800/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Total Websites
                </p>
                <p className="text-2xl font-light text-white mt-1">
                  {websites?.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FiGlobe className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  Active Projects
                </p>
                <p className="text-2xl font-light text-white mt-1">2</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FiFolder className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900/60 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-gray-600/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Views</p>
                <p className="text-2xl font-light text-white mt-1">1.2k</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <FiEye className="w-6 h-6 text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Websites Grid */}
      <main className="relative px-8 py-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {websites?.map((website, index) => (
          <Link key={website.id} href={`/w/${website.website_name}`}>
            <div
              className="group relative bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-sm border border-gray-700/40 rounded-2xl p-8 hover:border-gray-600/60 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Content */}
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-gray-400/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FiBarChart2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <FiExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <h2 className="text-xl font-medium text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                  {website.website_name}
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Manage your website analytics, track performance, and monitor
                  user engagement metrics.
                </p>

                {/* Status indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last updated 2h ago
                  </div>
                </div>
              </div>

              {/* Border gradient effect */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-transparent to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "xor",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  padding: "1px",
                }}
              ></div>
            </div>
          </Link>
        ))}
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
