import React, { useEffect, useState } from "react";
import FileUploader from "./FileUploader.jsx";
import pdfToText from "react-pdftotext";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Sidebar from "./Sidebar.jsx";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function Summarizer() {
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
                setLoading(false);
                fetchSummaries(session.user.id);
            }
        };

        checkUser();
    }, [navigate]);

    // Load every summary that belongs to the given user
    async function fetchSummaries(userId) {
        if (!userId) return;

        const { data, error } = await supabase
            .from("papers")
            .select("id, title, summary")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (!error) {
            setSummaries(data);
        } else {
            console.error("Failed to fetch summaries:", error.message);
        }
    }

    //extracts the text inside the pdf and inserts the new summarise inside the database
    async function extractText(file) {
        try {
            const text = await pdfToText(file);
            const generatedSummary = await summarizeText(text);

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
            console.error("Failed to extract text or summarize:", error);
            alert("Something went wrong while summarizing the document.");
        }
    }

    // Send the extracted text to the backend proxy, which holds the AI key and
    // returns the generated summary.
    async function summarizeText(text) {
        const response = await fetch(`${API_URL}/summarize`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();

        if (!response.ok || !data.summary) {
            throw new Error(data.error || "The summarization service returned an error.");
        }

        return data.summary;
    }

    // function that deletes the summary by the id
    async function handleDeleteSummary(id) {
        const confirmed = window.confirm("Are you sure you want to delete this summary?");
        if (!confirmed) return;

        try {
            const { error } = await supabase.from("papers").delete().eq("id", id);
            if (error) throw error;

            setSummaries((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Failed to delete summary:", err.message);
            alert("Something went wrong while deleting the summary.");
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
        return <div className="p-10 text-center text-xl">Checking your session...</div>;
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
