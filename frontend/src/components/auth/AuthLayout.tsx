"use client";

import { ListTodo, CheckCircle, Clock, Sparkles, Zap, Shield, BarChart3 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Premium Branding (hidden on mobile) */}
      <div className="hidden lg:flex relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full p-12 xl:p-16">
          {/* Top - Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TaskFlow</span>
          </div>

          {/* Middle - Hero content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium text-white/90">AI-Powered Productivity</span>
              </div>
              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Your tasks,
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent">
                  supercharged.
                </span>
              </h1>
              <p className="text-lg text-white/70 max-w-md leading-relaxed">
                The intelligent task manager that learns your workflow and helps you achieve more with less effort.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              <FeatureCard
                icon={<CheckCircle className="w-5 h-5" />}
                title="Smart Prioritization"
                description="AI ranks your tasks"
              />
              <FeatureCard
                icon={<Clock className="w-5 h-5" />}
                title="Due Date Tracking"
                description="Never miss deadlines"
              />
              <FeatureCard
                icon={<Sparkles className="w-5 h-5" />}
                title="Natural Language"
                description="Create tasks by chatting"
              />
              <FeatureCard
                icon={<BarChart3 className="w-5 h-5" />}
                title="Insights"
                description="Track your progress"
              />
            </div>
          </div>

          {/* Bottom - Trust indicators */}
          <div className="flex items-center gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure & Private</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <span>Free to use</span>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center bg-background relative px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Subtle gradient on form side */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-transparent to-cyan-50/30 dark:from-violet-950/20 dark:to-cyan-950/10" />

        <div className="w-full max-w-[420px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-3 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <ListTodo className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">TaskFlow</span>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-base leading-relaxed">{subtitle}</p>
          </div>

          {/* Form content */}
          {children}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3 text-white">
        {icon}
      </div>
      <h3 className="font-semibold text-white text-sm mb-0.5">{title}</h3>
      <p className="text-white/60 text-xs">{description}</p>
    </div>
  );
}
