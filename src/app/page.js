"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  Eye,
  Globe,
  Zap,
  Shield,
  Smartphone,
  ArrowRight,
  Star,
  Check,
  Menu,
  X,
} from "lucide-react";

export default function MyAnalyticsHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    websites: 0,
    visitors: 0,
    insights: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedNumbers({
        websites: 50000,
        visitors: 2500000,
        insights: 1000000,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Real-time Visitor Tracking",
      description:
        "Monitor your website visitors in real-time with detailed demographics and behavior patterns.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: "Advanced Analytics",
      description:
        "Get deep insights into your website performance with comprehensive reports and trends.",
    },
    {
      icon: <Eye className="w-8 h-8 text-white" />,
      title: "Page View Analytics",
      description:
        "Track page views, bounce rates, and user engagement across all your web pages.",
    },
    {
      icon: <Globe className="w-8 h-8 text-white" />,
      title: "Global Reach Analysis",
      description:
        "Understand your global audience with detailed geographic and demographic data.",
    },
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      title: "Lightning Fast Reports",
      description:
        "Generate comprehensive analytics reports in seconds with our optimized engine.",
    },
    {
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Privacy Compliant",
      description:
        "GDPR and CCPA compliant analytics that respect user privacy and data protection.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "MyAnalytics transformed how we understand our audience. The insights are incredible!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Founder",
      company: "StartupXYZ",
      content:
        "The real-time data and beautiful visualizations make decision-making so much easier.",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "E-commerce Manager",
      company: "ShopSmart",
      content:
        "Best analytics platform we've used. The ROI insights alone paid for itself.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MyAnalytics</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white">
              Testimonials
            </a>
            <button className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 px-6 py-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-300 hover:text-white">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white">
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-white"
              >
                Testimonials
              </a>
              <button className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative z-10">
            <div className="inline-block mb-6 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
              <span className="text-gray-300 text-sm font-medium">
                🚀 Advanced Website Analytics Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white">Unlock Your Website&lsquo;s</span>
              <br />
              <span className="text-gray-300">True Potential</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform raw data into actionable insights. Track visitors,
              analyze behavior, and grow your online presence with our
              cutting-edge analytics platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="group bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Start Free Trial
                <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-600 text-gray-300 hover:bg-gray-800 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {animatedNumbers.websites.toLocaleString()}+
                </div>
                <div className="text-gray-400">Websites Tracked</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {animatedNumbers.visitors.toLocaleString()}+
                </div>
                <div className="text-gray-400">Monthly Visitors</div>
              </div>
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {animatedNumbers.insights.toLocaleString()}+
                </div>
                <div className="text-gray-400">Insights Generated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Powerful Features for
              <br />
              <span className="text-gray-300">Data-Driven Growth</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand your audience and optimize your
              website performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:scale-105 hover:bg-gray-700"
              >
                <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mb-6">
                  <div>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-700 bg-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MyAnalytics</span>
          </div>
          <div className="text-gray-400 text-center md:text-right">
            <p>&copy; 2024 MyAnalytics. All rights reserved.</p>
            <p className="text-sm mt-2">
              Making analytics simple and actionable.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
