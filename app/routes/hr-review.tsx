import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { prepareHRReviewInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2image";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

export const meta = () => [
  { title: "Resumind | HR Quick Review" },
  { description: "Get instant HR-style feedback on your resume" },
];

const HRReviewUpload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async (file: File) => {
    try {
      setIsProcessing(true);
      setStatusText("Uploading the file...");

      const uploadedFile = await fs.upload([file]);

      if (!uploadedFile) {
        setIsProcessing(false);
        return setStatusText("Error: Failed to upload the file");
      }

      setStatusText("Converting to image...");
      const imageFile = await convertPdfToImage(file);

      if (!imageFile.file) {
        console.error(imageFile.error);
        setIsProcessing(false);
        return setStatusText(
          `Error: Failed to convert PDF to image. ${imageFile.error || ""}`
        );
      }

      setStatusText("Uploading the image...");
      const uploadedImage = await fs.upload([imageFile.file]);

      if (!uploadedImage) {
        setIsProcessing(false);
        return setStatusText("Error: Failed to upload the image");
      }

      setStatusText("Preparing data...");
      const uuid = generateUUID();

      const data: {
        id: string;
        resumePath: string;
        imagePath: string;
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        analysisType: "hr-review";
        feedback: string | object;
      } = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName: "",
        jobTitle: "",
        jobDescription: "",
        analysisType: "hr-review",
        feedback: "",
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText(
        "HR Quick Review in progress... (this may take 30-60 seconds)"
      );

      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareHRReviewInstructions()
      );

      if (!feedback) {
        setIsProcessing(false);
        return setStatusText(
          "Error: Failed to analyze resume. Please try again."
        );
      }

      setStatusText("Processing AI response...");

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      try {
        data.feedback = JSON.parse(feedbackText);
      } catch (parseError) {
        console.error("Failed to parse AI response:", feedbackText);
        setIsProcessing(false);
        return setStatusText(
          "Error: AI returned invalid response. Please try again."
        );
      }

      await kv.set(`resume:${uuid}`, JSON.stringify(data));
      setStatusText("Analysis complete, redirecting...");

      navigate(`/hr-review/${uuid}`);
    } catch (error) {
      console.error("HR Review error:", error);
      setIsProcessing(false);
      setStatusText(
        `Error: ${error instanceof Error ? error.message : "Something went wrong. Please try again."}`
      );
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    handleAnalyze(file);
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>HR Quick Review</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <>
              <h2>See your resume through a recruiter's eyes</h2>
              <p className="text-gray-500 mt-2">
                Get instant feedback on how HR would scan your resume in the
                first 6-10 seconds
              </p>
            </>
          )}
          {!isProcessing && (
            <form
              id="hr-upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume (PDF)</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="submit" disabled={!file}>
                Start HR Review
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default HRReviewUpload;
