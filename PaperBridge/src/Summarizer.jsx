import React, { useEffect, useState } from "react";
import FileUploader from "./FileUploader.jsx";
import pdfToText from "react-pdftotext";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Sidebar from "./Sidebar.jsx";

function Summarizer() {
    const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summaryCompleted, setSummaryCompleted] = useState(false);
    const [summary, setSummary] = useState("");
    const [summaries, setSummaries] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navigate = useNavigate();

    // Fetch all summaries when component mounts or redirects to login page if user not log in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) {
                navigate("/login");
            } else {
                setUser(session.user);
                setLoading(false);
                fetchSummaries(session.user.id);
            }
        };

        checkUser();
    }, [navigate]);

    //function that fetches all the summarise requested by the user
    async function fetchSummaries() {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) return;

        const { data, error } = await supabase
            .from("papers")
            .select("id, title, summary")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error) {
            setSummaries(data);
        } else {
            console.error("❌ Failed to fetch summaries:", error.message);
        }
    }

    //extracts the text inside the pdf and inserts the new summarise inside the database
    async function extractText(file) {
        try {
            const text = await pdfToText(file);
            const generatedSummary = await summarizeWithCohere(text);
            alert("✅ Riassunto completato");

            const title = file.name.replace(".pdf", "");
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            const user_id = sessionData?.session?.user?.id;

            const { data, error } = await supabase  // insert the summarise in the database
                .from("papers")
                .insert([{ user_id, title, summary: generatedSummary }])
                .select();

            if (error) throw error;

            // add the new summary as the first in the list
            if (data && data.length > 0) {
                setSummaries((prev) => [data[0], ...prev]);
            }

            setSummary(generatedSummary);
            setSummaryCompleted(true);

        } catch (error) {
            console.error("❌ Failed to extract text or summarize:", error);
            alert("Errore durante il riassunto.");
        }
    }

    // function that asks the summarise to the ai and waits for a response
    async function summarizeWithCohere(text) {
        const response = await fetch("https://api.cohere.ai/v1/summarize", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${COHERE_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text.slice(0, 4000),
                length: "medium",
                format: "paragraph",
                model: "command",
            }),
        });

        const data = await response.json();

        if (data.summary) {
            return data.summary;
        } else {
            throw new Error(data.message || "Errore dal server Cohere.");
        }
    }

    // function that deletes the summary by the id
    async function handleDeleteSummary(id) {
        const confirm = window.confirm("Sei sicuro di voler eliminare questo riassunto?");
        if (!confirm) return;

        try {
            const { error } = await supabase.from("papers").delete().eq("id", id);
            if (error) throw error;

            setSummaries((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("❌ Errore durante l'eliminazione:", err.message);
            alert("Errore durante l'eliminazione.");
        }
    }

    const handleNewSummary = () => {
        setSummary("");
        setSummaryCompleted(false);
    };

    const handleSelectSummary = (s) => {
        setSummary(s.summary);
        setSummaryCompleted(true);
        setIsSidebarOpen(false);
    };

    if (loading) {
        return <div className="p-10 text-center text-xl">🔒 Verifica accesso in corso...</div>;
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <div className="flex">
            {isSidebarOpen && (
                <Sidebar
                    summaries={summaries}
                    onSelect={handleSelectSummary}
                    onClose={() => setIsSidebarOpen(false)}
                    onNewSummary={handleNewSummary}
                    onDelete={handleDeleteSummary}
                />
            )}

            <main className="flex-1 p-6 relative">
                <button
                    className="absolute top-4 right-4 px-4 py-2 btn w-30 h-12"
                    onClick={handleLogout}
                >
                    Logout
                </button>
                {!isSidebarOpen && (
                    <button
                        className="text-2xl absolute top-4 left-4 z-10 text-gray-600 hover:text-black"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        ☰
                    </button>
                )}
                {!summaryCompleted ? (
                    <FileUploader onFileUpload={extractText} />
                ) : (
                    <div className="min-h-screen flex justify-center items-center px-4">
                        <div className="w-full max-w-5xl bg-white rounded-2xl border border-white shadow-xl p-10 sm:p-12 lg:p-16">
                            <h2 className="text-4xl font-bold text-lgred mb-8 text-center">🧠 Summary:</h2>
                            <div className="text-gray-800 whitespace-pre-line overflow-y-auto font-semibold max-h-[95vh] text-2xl leading-relaxed">
                                {summary}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Summarizer;
