import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useToast } from "./ui/toastContext.js";
import Spinner from "./ui/Spinner.jsx";

function Login() {
    const navigate = useNavigate();
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setSubmitting(false);

        if (error) {
            toast.error("Login failed: " + error.message);
            return;
        }

        navigate("/summarizer");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="text-center text-white2 font-bold text-3xl sm:text-4xl py-8">
                PaperBridge
            </header>

            <main className="flex-1 flex justify-center items-start pt-6 px-4">
                <form className="form" onSubmit={handleLogin}>
                    <p className="mb-8 font-bold text-lgred text-2xl sm:text-3xl">Welcome back</p>

                    <label htmlFor="login-email" className="field-label">Email</label>
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field"
                        required
                    />

                    <label htmlFor="login-password" className="field-label">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="field"
                        required
                    />

                    <button type="submit" className="btn mt-4" disabled={submitting}>
                        {submitting ? <Spinner /> : "Log in"}
                    </button>

                    <p className="text-sm text-gray-500 mt-6 mb-3">Don't have an account?</p>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate("/register")}
                    >
                        Create one
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Login;
