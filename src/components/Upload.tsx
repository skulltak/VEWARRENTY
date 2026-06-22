import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadProps {
  onUploadSuccess?: () => void;
}

export const Upload: React.FC<UploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/sales/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setResult({ success: true, message: data.message });
        setFile(null);
        onUploadSuccess?.();
      } else {
        setResult({ success: false, message: (data.message || 'Upload failed.') + (data.error ? ` — ${data.error}` : '') });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setResult({ success: false, message: `Could not connect to backend server. ${msg}` });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 h-full overflow-y-auto pr-2">
      
      {/* Header Info */}
      <div className="text-center">
        <h2 className="text-xl font-black text-slate-800">Upload Sales Sheet</h2>
        <p className="text-xs text-slate-500 mt-2">
          Select or drag and drop your transactional Excel/CSV file below. Database fields will map automatically.
        </p>
      </div>

      {/* Banner Response */}
      {result && (
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl text-xs font-semibold border ${
          result.success 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
            : 'bg-red-500/10 border-red-500/20 text-red-600'
        }`}>
          {result.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{result.message}</span>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
            : file 
              ? 'border-slate-300 bg-slate-50/30' 
              : 'border-slate-200 bg-white/70 hover:border-slate-350 hover:bg-white'
        }`}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />

        {!file ? (
          <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 mb-2">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-700">Click to browse or drag & drop file here</h3>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Supports standard tabular document sheets with extensions <strong className="text-slate-500">.csv</strong>, <strong className="text-slate-500">.xlsx</strong>, or <strong className="text-slate-500">.xls</strong>
            </p>
          </label>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 truncate max-w-md">{file.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl text-xs font-bold transition duration-300 shadow-lg shadow-blue-500/10"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2.5 border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-bold transition duration-300 bg-white"
              >
                Remove File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expected Headers section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
          Expected Template Header Columns
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            'STORE NAME', 'BRAND', 'PRODUCT', 'SERIAL NO', 'BILL VALUE', 'BILL DATE',
            'CUSTOMER NAME', 'CUSTOMER CONTACT', 'CUSTOMER EMAIL ID', 'BRAND WARRANTY',
            'EXTENDED WARRANTY', 'ACTIVATION VALUE', 'BILL NO', 'Order id', 'mai yes/ no',
            'Payment', 'Date received'
          ].map((col) => (
            <span
              key={col}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[10px] text-slate-550 font-mono rounded-lg tracking-wider"
            >
              {col}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
