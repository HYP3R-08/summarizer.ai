import React, { useEffect, useState } from "react";
import FileUploader from "./FileUploader.jsx";
import pdfToText from "react-pdftotext";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Sidebar from "./Sidebar.jsx";
import ConfirmDialog from "./ui/ConfirmDialog.jsx";
import { useToast } from "./ui/toastContext.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

function Summarizer() {
    const [loading, setLoading] = useState(true);
    const [summarizing, setSummarizing] = useState(false);
    const [summaryCompleted, setSummaryCompleted] = useState(false);
    const [summary, setSummary] = useState("");
    const [summaries, setSummaries] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const navigate = useNavigate();
    const toast = useToast();

    // Redirect to login when there is no session, otherwise load the summaries.
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

    // Load every summary that belongs to the given user.
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

    // Extract the PDF text, summarize it and store the result.
    async function extractText(file) {
        setSummarizing(true);
        try {
            const text = await pdfToText(file);
            const { summary: generatedSummary, truncated } = await summarizeText(text);

            const title = file.name.replace(/\.pdf$/i, "");
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw sessionError;

            const user_id = sessionData?.session?.user?.id;

            const { data, error } = await supabase
                .from("papers")
                .insert([{ user_id, title, summary: generatedSummary }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setSummaries((prev) => [data[0], ...prev]);
            }

            setSummary(generatedSummary);
            setSummaryCompleted(true);
            toast.success("Summary ready.");
            if (truncated) {
                toast.info("The document was long, so only its first pages were summarized.");
            }
        } catch (error) {
            console.error("Failed to extract text or summarize:", error);
            toast.error("Something went wrong while summarizing the document.");
        } finally {
            setSummarizing(false);
        }
    }

    // Send the extracted text to the backend proxy, which holds the AI key.
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

        return data;
    }

    async function confirmDelete() {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            const { error } = await supabase.from("papers").delete().eq("id", id);
            if (error) throw error;

            setSummaries((prev) => prev.filter((s) => s.id !== id));
            toast.success("Summary deleted.");
        } catch (err) {
            console.error("Failed to delete summary:", err.message);
            toast.error("Something went wrong while deleting the summary.");
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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex-center gap-3 text-xl text-white2/80">
                <span className="spinner" />
                Checking your session...
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {isSidebarOpen && (
                <Sidebar
                    summaries={summaries}
                    onSelect={handleSelectSummary}
                    onClose={() => setIsSidebarOpen(false)}
                    onNewSummary={handleNewSummary}
                    onDelete={(id) => setPendingDeleteId(id)}
                />
            )}

            <main className="flex-1 p-6 relative">
                <div className="absolute top-4 right-4 z-10">
                    <button className="btn w-32 h-11 text-base" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
                {!isSidebarOpen && (
                    <button
                        className="text-3xl absolute top-4 left-4 z-10 text-white2/70 hover:text-white2 transition"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        ☰
                    </button>
                )}
                {!summaryCompleted ? (
                    <FileUploader onFileUpload={extractText} busy={summarizing} />
                ) : (
                    <div className="min-h-screen flex justify-center items-start pt-20 px-4">
                        <div className="surface-card w-full max-w-4xl p-8 sm:p-12 animate-fade-in">
                            <h2 className="text-3xl sm:text-4xl font-bold text-lgred mb-6 text-center">
                                Summary
                            </h2>
                            <div className="text-white2/90 whitespace-pre-line overflow-y-auto leading-relaxed text-lg max-h-[70vh]">
                                {summary}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <ConfirmDialog
                open={pendingDeleteId !== null}
                title="Delete summary"
                message="Are you sure you want to delete this summary? This cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
            />
        </div>
    );
}

export default Summarizer;
