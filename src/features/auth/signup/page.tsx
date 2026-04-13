"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";
import { toast } from "sonner";

export default function SignupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !email || !password) return toast.error("Please fill in all fields.");
        if (password.length < 6) return toast.error("Password must be at least 6 characters.");
        setLoading(true);
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const displayName = `${firstName} ${lastName}`.trim();

            // Update Firebase Auth display name
            await updateProfile(credential.user, { displayName });

            // Save to Firestore
            const { upsertUserProfile } = await import("@/lib/firestore");
            await upsertUserProfile(credential.user.uid, {
                displayName,
                email,
                photoURL: "",
            });

            toast.success(`Welcome to Nomadi Circle, ${firstName}! 🌏`);
            router.push("/feed");
        } catch (err: any) {
            const msg = err.code === "auth/email-already-in-use"
                ? "An account with this email already exists."
                : err.code === "auth/weak-password"
                    ? "Password must be at least 6 characters."
                    : err.code === "auth/invalid-email"
                        ? "Please enter a valid email address."
                        : "Sign-up failed. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-orange-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1887&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h2 className="text-5xl font-heading font-bold mb-6">
                        Join the <br /> Circle.
                    </h2>
                    <p className="text-xl font-light text-gray-200">
                        Start your journey today. Share stories, find travel buddies, and explore the world like never before.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-heading font-bold text-foreground">Create account</h1>
                        <p className="text-muted-foreground mt-2">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Log in
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
                                <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleSignup}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rohan"
                                            className="pl-10"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last name</label>
                                    <Input
                                        placeholder="Sharma"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

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
                                        placeholder="Create a strong password (6+ chars)"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full h-11 text-base bg-secondary hover:bg-secondary/90"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                                ) : (
                                    <>Get Started <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </form>

                        <p className="text-xs text-center text-muted-foreground">
                            By clicking "Get Started", you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
