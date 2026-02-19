
import React, { useState, useCallback } from 'react';
import { UploadCloud, X, FileText } from 'lucide-react';

interface VcfUploadProps {
  onFileChange: (file: File | null) => void;
}

export const VcfUpload: React.FC<VcfUploadProps> = ({ onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((selectedFile: File) => {
    setError(null);
    if (!selectedFile.name.endsWith('.vcf')) {
      setError('Invalid file type. Please upload a .vcf file.');
      setFile(null);
      onFileChange(null);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      setError('File is too large. Maximum size is 5MB.');
      setFile(null);
      onFileChange(null);
      return;
    }
    setFile(selectedFile);
    onFileChange(selectedFile);
  }, [onFileChange]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    onFileChange(null);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-cyan-400 dark:hover:border-cyan-500 bg-slate-50 dark:bg-slate-700/50'}`}
      >
        {!file && (
          <>
            <input type="file" id="vcf-upload" className="hidden" accept=".vcf" onChange={handleFileSelect} />
            <label htmlFor="vcf-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">VCF format only (max 5MB)</p>
            </label>
          </>
        )}
        {file && (
          <div className="p-4 text-center">
             <FileText className="w-12 h-12 mx-auto text-cyan-500" />
             <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
             <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
      </div>
      {file && (
         <button onClick={removeFile} className="mt-2 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center gap-1 mx-auto">
            <X size={14} /> Remove file
         </button>
      )}
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
