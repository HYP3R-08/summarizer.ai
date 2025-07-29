import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from './supabaseClient';
import { useState } from "react";

function Login() {
    
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("Login failed: " + error.message);
            return;
        }

        const userId = data.user.id;

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (userError) {
            console.error("Errore nel recupero dell'utente:", userError);
            alert("Utente non trovato nella tabella 'users'.");
            return;
        }

        // Qui userData è il record unico
        navigate("/summarizer");
    };

    const handleSignIn = () => {
        navigate("/register")
    };

    return (
        <div className="h-screen flex flex-col ">

            <header className="text-center text-white2 font-bold text-4xl py-6 ">
                Paperbridge
            </header>

            <main className="flex-1 flex justify-center items-center ">
                <div className="form" style={{ transform: "translateY(-15%)" }} >
                    <p className="mb-14 font-bold text-lgred text-[28px]">Welcome Back!</p>

                    <label className="w-full text-left mb-2 text-xl ">Email:</label>
                    <input
                        type="text"
                        placeholder="Enter the email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="w-full text-left mb-2 text-xl">Password:</label>
                    <input
                        type="password"
                        placeholder="Enter the password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-10 p-2 border border-gray-300 rounded w-full "
                    />

                    <button className="btn max-w-xs text-xl mb-12 shadow-2xl" onClick={handleLogin}>
                        Login
                    </button>

                    <p className="text-lg mb-2">Or if you don't have an account</p>
                    <button className="btn max-w-xs text-xl mb-2 bg-white shadow-2xl text-lgred hover:bg-[#dcd7d7]" onClick={handleSignIn}>Sign in</button>
                </div>
            </main>
        </div>
    )
}

export default Login