import React, { useRef, useState } from "react";

function FileUploader({ onFileUpload }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && (file.type === "application/pdf")) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      alert("Only PDF files are allowed.");
    }
  };

  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <div>
        <header className="text-center text-white2 font-bold text-4xl py-6">
            Paperbridge
        </header>
        <div className="h-screen flex items-center justify-center ">
            <div className={`
                    drag-drop border-lgred 
                    ${dragging ? "border-blue-500 bg-blue-50 text-black" : "border-gray-300"}
                `}
                style={{ transform: "translateY(-30%)" }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                >
                <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <p className="text-3xl font-semibold mt-20">
                    {fileName ? `Selected file: ${fileName}` : "Drag & drop a PDF file here"}
                </p>
                <p className="text-lg text-gray-300">or click to browse your files</p>
            </div>
        </div>
    </div>
  );
}

export default FileUploader;