"use client";

import React, { useState } from "react";
import {
  Upload,
  Lock,
  Unlock,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react";

export default function DocxToPdfConverter() {
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [encrypt, setEncrypt] = useState(false);
  const [password, setPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProgress(0);
      setFileUploaded(true);
      setDownloadUrl(null);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEncryptChange = () => {
    setEncrypt(!encrypt);
    if (!encrypt) {
      setPassword("");
    }
  };

  const handleConvertToPDF = async () => {
    if (!file) {
      alert("Please upload a .docx file");
      return;
    }
    if (encrypt && !password) {
      alert("Please enter a password for encryption");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (encrypt) {
      formData.append("password", password);
    }

    try {
      setIsProcessing(true);
      setProgress(10);

      const endpoint = encrypt
        ? "https://docpdfbackend-production.up.railway.app/convert-to-encrypted-pdf"
        : "https://docpdfbackend-production.up.railway.app/convert-to-pdf";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setProgress(80);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        console.log("Download URL:", url);
        setDownloadUrl(url);
        setProgress(100);
      } else {
        alert("File conversion failed.");
        setProgress(0);
      }
    } catch (error) {
      console.error("Error converting file:", error);
      alert("An error occurred.");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleBackClick = () => {
    // Reset the state to allow file upload again
    setFile(null);
    setFileUploaded(false);
    setEncrypt(false);
    setPassword("");
    setProgress(0);
    setDownloadUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 w-screen">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        {downloadUrl && (
          <button
            onClick={handleBackClick}
            className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            Convert .docx to PDF
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Upload your file, encrypt if needed, and convert
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* File Upload */}
          {!fileUploaded && (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">.docx files only</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".docx"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          )}

          {file && (
            <div className="text-sm text-gray-400 text-center">
              <FileText className="inline-block w-4 h-4 mr-2" />
              {file.name}
              <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
              <p>File Type: {file.type || "Unknown"}</p>
            </div>
          )}

          {/* Encrypt Option */}
          <div className="flex items-center">
            <input
              id="encrypt-toggle"
              type="checkbox"
              checked={encrypt}
              onChange={handleEncryptChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2"
            />
            <label
              htmlFor="encrypt-toggle"
              className="ml-2 text-sm font-medium text-gray-300"
            >
              Encrypt PDF
            </label>
          </div>

          {/* Password Input */}
          {encrypt && (
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter encryption password"
                  className="w-full px-3 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {encrypt ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Unlock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvertToPDF}
            disabled={!file || isProcessing}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isProcessing || !file
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            } transition-colors duration-300`}
          >
            {isProcessing ? "Processing..." : "Convert to PDF"}
          </button>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {progress === 100 ? "Completed" : "Processing"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500 ease-out"
                ></div>
              </div>
            </div>
          )}

          {/* Download Button */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={file?.name.replace(
                ".docx",
                encrypt ? "_encrypted.pdf" : ".pdf"
              )}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              <Download className="w-5 h-5 mr-2" />
              Download PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
