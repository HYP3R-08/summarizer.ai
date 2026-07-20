import React from "react";

function Sidebar({ summaries, onSelect, onClose, onNewSummary, onDelete }) {
    return (
        <aside className="w-72 shrink-0 bg-ink border-r border-white/10 h-screen sticky top-0 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white2">Your summaries</h2>
                <button
                    className="w-8 h-8 rounded-lg text-white2/70 hover:text-white2 hover:bg-white/10 transition"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto -mr-2 pr-2">
                {summaries.length === 0 ? (
                    <p className="text-sm text-white2/50 text-center mt-8 px-2">
                        No summaries yet. Upload a PDF to create your first one.
                    </p>
                ) : (
                    <ul className="space-y-1">
                        {summaries.map((s) => (
                            <li
                                key={s.id}
                                className="group flex items-center gap-2 rounded-lg px-3 py-2 text-white2/90 hover:bg-white/10 transition"
                            >
                                <button
                                    className="flex-1 min-w-0 text-left truncate font-medium cursor-pointer"
                                    onClick={() => onSelect(s)}
                                    title={s.title}
                                >
                                    {s.title}
                                </button>
                                <button
                                    onClick={() => onDelete(s.id)}
                                    className="shrink-0 text-white2/40 hover:text-lgred opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
                                    aria-label={`Delete ${s.title}`}
                                    title="Delete"
                                >
                                    🗑
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="pt-4 border-t border-white/10">
                <button onClick={onNewSummary} className="btn w-full h-12 text-base">
                    New summary
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
