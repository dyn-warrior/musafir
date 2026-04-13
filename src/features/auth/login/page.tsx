"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return toast.error("Please fill in all fields.");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back! 🌏");
            router.push("/feed");
        } catch (err: any) {
            const msg = err.code === "auth/invalid-credential"
                ? "Invalid email or password."
                : err.code === "auth/user-not-found"
                    ? "No account found with this email."
                    : "Sign-in failed. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-teal-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h2 className="text-5xl font-heading font-bold mb-6">
                        Welcome back, <br /> Nomad.
                    </h2>
                    <p className="text-xl font-light text-gray-200">
                        Your next adventure is waiting. Log in to access your saved itineraries and connect with your travel tribe.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-heading font-bold text-foreground">Sign in</h1>
                        <p className="text-muted-foreground mt-2">
                            New to Nomadi Circle?{" "}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Google */}
                        <GoogleLoginButton />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                            </div>
                        </div>

                        {/* Email form */}
                        <form className="space-y-4" onSubmit={handleEmailLogin}>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button className="w-full h-11 text-base" type="submit" disabled={loading}>
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                                ) : (
                                    <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
