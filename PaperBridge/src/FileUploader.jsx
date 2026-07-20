import React, { useRef, useState } from "react";
import { useToast } from "./ui/toastContext.js";

function FileUploader({ onFileUpload, busy = false }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!busy) setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (busy) return;
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const processFile = (file) => {
    if (file && file.type === "application/pdf") {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  const triggerFileSelect = () => {
    if (!busy) fileInputRef.current.click();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerFileSelect();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <header className="text-center mb-2">
        <h1 className="text-4xl font-bold text-white2">PaperBridge</h1>
        <p className="text-white2/60 mt-2">Drop a PDF and get a concise summary.</p>
      </header>

      <div
        className={`drag-drop mt-8 ${dragging ? "is-dragging" : ""} ${busy ? "opacity-70 cursor-wait" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Upload a PDF file"
        aria-busy={busy}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        onKeyDown={handleKeyDown}
      >
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={busy}
        />

        {busy ? (
          <div className="flex flex-col items-center gap-3">
            <span className="spinner !w-8 !h-8" />
            <p className="text-xl font-semibold">Summarizing your document...</p>
            <p className="text-sm text-white2/60">This can take a few seconds.</p>
          </div>
        ) : (
          <>
            <svg
              width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              className="text-lgred"
            >
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            <p className="text-xl font-semibold">
              {fileName ? `Selected: ${fileName}` : "Drag & drop a PDF here"}
            </p>
            <p className="text-sm text-white2/60">or click to browse your files</p>
          </>
        )}
      </div>
    </div>
  );
}

export default FileUploader;
