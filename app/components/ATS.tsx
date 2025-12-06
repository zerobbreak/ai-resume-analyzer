import React from "react";

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
  let gradientClass = "from-red-100";
  let textColor = "text-red-600";
  let borderColor = "border-red-200";

  if (score > 69) {
    gradientClass = "from-green-100";
    textColor = "text-green-600";
    borderColor = "border-green-200";
  } else if (score > 49) {
    gradientClass = "from-yellow-100";
    textColor = "text-yellow-600";
    borderColor = "border-yellow-200";
  }

  return (
    <div
      className={`w-full rounded-2xl p-6 bg-linear-to-br ${gradientClass} to-white shadow-sm border ${borderColor}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">ATS Compliance</h3>
          <p className="text-sm text-gray-500 mt-1">
            Applicant Tracking System check
          </p>
        </div>
        <div className={`text-4xl font-bold ${textColor}`}>{score}%</div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700">Suggestions</h4>
        <div className="flex flex-col gap-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex gap-3 items-start bg-white/60 p-3 rounded-xl border border-white/50 shadow-sm"
            >
              <div
                className={`mt-1.5 min-w-2.5 h-2.5 rounded-full shadow-sm ${
                  suggestion.type === "good" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <p className="text-gray-700 text-sm leading-relaxed">
                {suggestion.tip}
              </p>
            </div>
          ))}
          {suggestions.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              No specific suggestions found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATS;
