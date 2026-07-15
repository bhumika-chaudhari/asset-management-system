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
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6">

      {/* Background Glow */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <div className="relative z-10 grid w-full max-w-7xl gap-16 lg:grid-cols-2">

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden flex-col justify-center text-white lg:flex"
        >
          <h1 className="text-6xl font-extrabold leading-tight">
            Asset
            <br />
            Management
            <br />
            System
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
            Manage company assets, employee allocations,
            maintenance schedules, and business reports
            from one powerful dashboard.
          </p>

          <div className="mt-14 space-y-8">

            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-indigo-600/20 p-4">
                <ShieldCheck
                  className="text-indigo-400"
                  size={30}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Secure Authentication
                </h3>

                <p className="text-slate-400">
                  JWT Protected Login
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-cyan-600/20 p-4">
                <Laptop
                  className="text-cyan-400"
                  size={30}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
                  Asset Tracking
                </h3>

                <p className="text-slate-400">
                  Monitor every company asset
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-emerald-600/20 p-4">
                <Users
                  className="text-emerald-400"
                  size={30}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold">
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
          initial={{
            opacity: 0,
            x: 80,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="flex items-center justify-center"
        >
          <motion.div
            whileHover={{
              y: -5,
            }}
            transition={{
              duration: 0.25,
            }}
          >
            <Card className="w-full max-w-md">

              <div className="mb-8 text-center">

                <h2 className="text-4xl font-bold text-white">
                  Welcome Back
                </h2>

                <p className="mt-3 text-slate-300">
                  Sign in to your account
                </p>

              </div>

              <form className="space-y-6">

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
        </motion.div>

      </div>

    </div>
  );
}