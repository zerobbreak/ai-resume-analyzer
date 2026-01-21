import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCirle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, imagePath, feedback },
}: {
  resume: Resume;
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string | null>();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      if (!imagePath) return;
      try {
        const blob = await fs.read(imagePath);
        if (!blob) {
          setImageError(true);
          return;
        }

        let url = URL.createObjectURL(blob);
        setResumeUrl(url);
      } catch {
        console.log("Failed to load resume image");
        setImageError(true);
      }
    };
    loadResume();
  }, [imagePath]);

  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className=" text-black! font-bold wrap-break-word line-clamp-2">
              {companyName}
            </h2>
          )}
          {jobTitle && (
            <h3 className="text-lg wrap-break-word text-gray-500">
              {jobTitle}
            </h3>
          )}

          {!companyName && !jobTitle && (
            <h2 className=" text-black! font-bold">Resume</h2>
          )}
        </div>
        <div className="shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
      </div>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}

      {imageError && !resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000 bg-gray-100">
          <div className="w-full h-[350px] max-sm:h-[200px] flex items-center justify-center text-gray-400">
            <span>Preview not available</span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
