import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen flex flex-col justify-center items-center text-center px-6">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface/60 px-4 py-1.5 text-sm text-white2/70">
                AI-powered PDF summaries
            </span>

            <h1 className="text-white2 font-bold tracking-tight text-5xl sm:text-6xl md:text-7xl">
                Paper<span className="text-lgred">Bridge</span>
            </h1>

            <p className="text-white2/70 text-lg sm:text-2xl max-w-xl mt-6">
                Turn long PDFs into concise, readable summaries and keep them in your
                personal library.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button className="btn" onClick={() => navigate("/login")}>
                    Get started
                </button>
                <button className="btn btn-ghost" onClick={() => navigate("/register")}>
                    Create account
                </button>
            </div>
        </main>
    );
}

export default Home;
