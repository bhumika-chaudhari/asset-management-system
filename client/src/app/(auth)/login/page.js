"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import {
  ShieldCheck,
  Laptop,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login clicked");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">

      {/* Background Glow */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <div className="relative z-10 grid w-full max-w-7xl gap-16 lg:grid-cols-2">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col justify-center text-white"
        >
          <h1 className="text-6xl font-extrabold leading-tight">
            Asset
            <br />
            Management
            <br />
            System
          </h1>

          <p className="mt-8 max-w-xl text-lg text-slate-300 leading-8">
            Manage assets, employees, maintenance,
            allocations and reports from one modern dashboard.
          </p>

          <div className="mt-14 space-y-8">

            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-indigo-500/20 p-4">
                <ShieldCheck
                  className="text-indigo-400"
                  size={28}
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Secure Authentication
                </h3>
                <p className="text-slate-400">
                  JWT Protected Login
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-cyan-500/20 p-4">
                <Laptop
                  className="text-cyan-400"
                  size={28}
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Asset Tracking
                </h3>
                <p className="text-slate-400">
                  Track every company asset
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-emerald-500/20 p-4">
                <Users
                  className="text-emerald-400"
                  size={28}
                />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Employee Allocation
                </h3>
                <p className="text-slate-400">
                  Assign and return assets easily
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center"
        >
          <Card className="w-full max-w-md">

            <div className="mb-8 text-center">
              <h2 className="text-4xl font-bold text-white">
                Welcome Back
              </h2>

              <p className="mt-2 text-slate-400">
                Sign in to continue
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />

              <Button type="submit">
                Login
              </Button>
            </form>

          </Card>
        </motion.div>

      </div>

    </div>
  );
}