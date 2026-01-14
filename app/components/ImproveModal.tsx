import React, { useState } from "react";
import { cn } from "~/lib/utils";

interface ImproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  improvedContent: ImprovedContent | null;
  error: string | null;
}

interface ImprovedContent {
  sections: {
    category: string;
    originalIssue: string;
    improvedText: string;
  }[];
  summary: string;
}

const ImproveModal = ({
  isOpen,
  onClose,
  isLoading,
  improvedContent,
  error,
}: ImproveModalProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyAll = async () => {
    if (!improvedContent) return;
    const allText = improvedContent.sections
      .map((s) => `## ${s.category}\n\n${s.improvedText}`)
      .join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(allText);
      setCopiedIndex(-1);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Improved CV Content
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Copy these improvements to your resume
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4" />
              <p className="text-gray-600 font-medium">
                Generating improvements...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This may take 30-60 seconds
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              <p className="font-medium">Error generating improvements</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {improvedContent && !isLoading && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="font-medium text-purple-800">Summary</p>
                <p className="text-purple-700 text-sm mt-1">
                  {improvedContent.summary}
                </p>
              </div>

              {/* Sections */}
              {improvedContent.sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-5 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {section.category}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Original issue: {section.originalIssue}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(section.improvedText, index)
                      }
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        copiedIndex === index
                          ? "bg-green-100 text-green-700"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {copiedIndex === index ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {section.improvedText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {improvedContent && !isLoading && (
          <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={copyAll}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                copiedIndex === -1
                  ? "bg-green-500 text-white"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              )}
            >
              {copiedIndex === -1 ? "All Copied!" : "Copy All"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImproveModal;
