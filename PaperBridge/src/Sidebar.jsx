// Sidebar.jsx
import React from "react";

function Sidebar({ summaries, onSelect, onClose, onNewSummary, onDelete }) {
    return (
        <aside className="w-64 bg-[#494949] border-r border-gray-300 h-screen p-4 flex flex-col relative">
            <button
                className="absolute top-4 right-4 font-bold text-xl cursor-pointer text-white2 hover:text-black"
                onClick={onClose}
            >
                X
            </button>

            <h2 className="text-lg font-bold text-white text-center mb-8 mt-8 mr-10">
                Your Summaries
            </h2>

            <div className="flex-1 overflow-y-auto pr-2">
                <ul className="space-y-2">
                    {summaries.map((s) => (
                        <li
                            key={s.id}
                            className="flex items-center justify-between bg-transparent rounded hover:bg-gray-200 text-lg font-semibold text-white2 hover:text-blacker p-2"
                        >
                            <span
                                className="cursor-pointer flex-1 text-center"
                                onClick={() => onSelect(s)}
                            >
                                {s.title.length > 15 ? s.title.slice(0, 15) + "…" : s.title}
                            </span>
                            <button
                                onClick={() => onDelete(s.id)}
                                className="text-red-400 hover:text-red-600 ml-2 cursor-pointer hover:bg-lgred"
                                title="Elimina"
                            >
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="pt-4 border-t border-gray-300">
                <button onClick={onNewSummary} className="btn w-full">
                    New Summary
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
