import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import HRReview from "~/components/HRReview";
import ImproveModal from "~/components/ImproveModal";
import { prepareImprovementInstructions } from "~/constants";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | HR Quick Review Results" },
  { description: "Your HR-style resume feedback" },
];

interface ImprovedContent {
  sections: {
    category: string;
    originalIssue: string;
    improvedText: string;
  }[];
  summary: string;
}

const HRReviewResults = () => {
  const { auth, isLoading, fs, kv, ai } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumePath, setResumePath] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>("");
  const [feedback, setFeedback] = useState<HRReviewFeedback | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  // Improve modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [improvedContent, setImprovedContent] =
    useState<ImprovedContent | null>(null);
  const [improveError, setImproveError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/hr-review/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const resume = await kv.get(`resume:${id}`);

        if (!resume) {
          setNotFound(true);
          return;
        }

        const data = JSON.parse(resume);
        console.log("HR Review Data:", data);

        // Verify this is an HR review
        if (data.analysisType !== "hr-review") {
          navigate(`/resume/${id}`);
          return;
        }

        setResumePath(data.resumePath);
        setImagePath(data.imagePath);

        const resumeBlob = await fs.read(data.resumePath);
        if (resumeBlob) {
          const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
          const url = URL.createObjectURL(pdfBlob);
          setResumeUrl(url);
        }

        const imageBlob = await fs.read(data.imagePath);
        if (imageBlob) {
          const image = new Blob([imageBlob], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(image);
          setImageUrl(imageUrl);
        }

        setFeedback(data.feedback);
      } catch (error) {
        console.error("Error loading HR review:", error);
      }
    };

    loadResume();
  }, [id]);

  const handleImprove = async () => {
    if (!feedback || !resumePath) return;

    setIsModalOpen(true);
    setIsImproving(true);
    setImproveError(null);

    try {
      // Collect all "improve" tips from HR feedback
      const improveTips: {
        category: string;
        tip: string;
        explanation: string;
      }[] = [];

      const categories = [
        { key: "firstImpression", name: "First Impression" },
        { key: "visualHierarchy", name: "Visual Hierarchy" },
        { key: "scannability", name: "Scannability" },
        { key: "keyInformation", name: "Key Information" },
      ];

      categories.forEach(({ key, name }) => {
        const categoryFeedback = feedback[key as keyof HRReviewFeedback];
        if (
          categoryFeedback &&
          typeof categoryFeedback === "object" &&
          "tips" in categoryFeedback
        ) {
          (
            categoryFeedback as {
              tips: { type: string; tip: string; explanation?: string }[];
            }
          ).tips.forEach((tip) => {
            if (tip.type === "improve") {
              improveTips.push({
                category: name,
                tip: tip.tip,
                explanation: tip.explanation || "",
              });
            }
          });
        }
      });

      if (improveTips.length === 0) {
        setImproveError("No areas marked for improvement found.");
        setIsImproving(false);
        return;
      }

      const instructions = prepareImprovementInstructions(improveTips);
      const response = await ai.improveResume(resumePath, instructions);

      if (!response) {
        throw new Error("Failed to get improvement suggestions");
      }

      const responseText =
        typeof response.message.content === "string"
          ? response.message.content
          : response.message.content[0].text;

      const improved = JSON.parse(responseText) as ImprovedContent;
      setImprovedContent(improved);
    } catch (error) {
      console.error("Improve error:", error);
      setImproveError(
        error instanceof Error
          ? error.message
          : "Failed to generate improvements"
      );
    } finally {
      setIsImproving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isDeleting) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this resume? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete files from Puter fs (ignore errors if files don't exist)
      try {
        if (resumePath) await fs.delete(resumePath);
      } catch {
        console.log("Resume file already deleted or not found");
      }
      try {
        if (imagePath) await fs.delete(imagePath);
      } catch {
        console.log("Image file already deleted or not found");
      }

      // Delete KV entry
      await kv.delete(`resume:${id}`);

      // Navigate home
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete resume. Please try again.");
      setIsDeleting(false);
    }
  };

  // Show not found message if resume doesn't exist
  if (notFound) {
    return (
      <main className="pt-0!">
        <nav className="resume-nav">
          <Link to="/" className="back-button">
            <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
            <span className="text-gray-800 text-sm font-semibold">
              Back to Home
            </span>
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Resume Not Found</h2>
          <p className="text-gray-600">This resume may have been deleted.</p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-0!">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Home
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-screen sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-4xl text-black! font-bold">HR Quick Review</h2>
            {feedback && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImprove}
                  className="px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Improve CV
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-500 mb-4">
            How a recruiter would see your resume in 6-10 seconds
          </p>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <HRReview feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>

      <ImproveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isImproving}
        improvedContent={improvedContent}
        error={improveError}
      />
    </main>
  );
};

export default HRReviewResults;
