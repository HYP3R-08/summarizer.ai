import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useToast } from "./ui/toastContext.js";
import Spinner from "./ui/Spinner.jsx";

function SignIn() {
    const navigate = useNavigate();
    const toast = useToast();
    const [emailForm, setEmailForm] = useState("");
    const [usernameForm, setUsernameForm] = useState("");
    const [passwordForm, setPasswordForm] = useState("");
    const [confirmPasswordForm, setConfirmPasswordForm] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!emailForm || !usernameForm || !passwordForm) {
            toast.error("Please fill in all required fields.");
            return;
        }
        if (passwordForm !== confirmPasswordForm) {
            toast.error("The passwords do not match.");
            return;
        }

        setSubmitting(true);
        const success = await signUp(emailForm, passwordForm);
        setSubmitting(false);
        if (success) {
            navigate("/summarizer");
        }
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            toast.error(error.message);
            return false;
        }

        const { error: insertError } = await supabase
            .from("users")
            .insert([{ id: data.user.id, email, username: usernameForm }]);

        if (insertError) {
            toast.error("Could not create your profile: " + insertError.message);
            return false;
        }

        return true;
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="text-center text-white2 font-bold text-3xl sm:text-4xl py-8">
                PaperBridge
            </header>

            <main className="flex-1 flex justify-center items-start pt-2 px-4">
                <form className="form" onSubmit={handleRegister}>
                    <p className="mb-8 font-bold text-lgred text-2xl sm:text-3xl">Create your account</p>

                    <label htmlFor="signup-email" className="field-label">Email</label>
                    <input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={emailForm}
                        onChange={(e) => setEmailForm(e.target.value)}
                        className="field"
                        required
                    />

                    <label htmlFor="signup-username" className="field-label">Username</label>
                    <input
                        id="signup-username"
                        type="text"
                        autoComplete="username"
                        placeholder="Choose a username"
                        value={usernameForm}
                        onChange={(e) => setUsernameForm(e.target.value)}
                        className="field"
                        required
                    />

                    <label htmlFor="signup-password" className="field-label">Password</label>
                    <input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Create a password"
                        value={passwordForm}
                        onChange={(e) => setPasswordForm(e.target.value)}
                        className="field"
                        required
                    />

                    <label htmlFor="signup-confirm" className="field-label">Confirm password</label>
                    <input
                        id="signup-confirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={confirmPasswordForm}
                        onChange={(e) => setConfirmPasswordForm(e.target.value)}
                        className="field"
                        required
                    />

                    <button type="submit" className="btn mt-4" disabled={submitting}>
                        {submitting ? <Spinner /> : "Register"}
                    </button>

                    <p className="text-sm text-gray-500 mt-6 mb-3">Already have an account?</p>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => navigate("/login")}
                    >
                        Log in
                    </button>
                </form>
            </main>
        </div>
    );
}

export default SignIn;
