import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
        score > 69
          ? "bg-badge-green"
          : score > 39
            ? "bg-badge-yellow"
            : "bg-badge-red"
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          score > 69
            ? "text-badge-green-text"
            : score > 39
              ? "text-badge-yellow-text"
              : "text-badge-red-text"
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
  subtitle,
}: {
  title: string;
  categoryScore: number;
  subtitle?: string;
}) => {
  return (
    <div className="flex flex-col gap-1 py-2">
      <div className="flex flex-row gap-4 items-center">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
      {subtitle && <p className="text-sm text-gray-500 italic">{subtitle}</p>}
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div className="flex flex-row gap-2 items-center" key={index}>
            <img
              src={
                tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
              }
              alt="score"
              className="size-5"
            />
            <p className="text-xl text-gray-500 ">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4",
              tip.type === "good"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-yellow-50 border border-yellow-200 text-yellow-700"
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                src={
                  tip.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt="score"
                className="size-5"
              />
              <p className="text-xl font-semibold">{tip.tip}</p>
            </div>
            <p>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PassIndicator = ({ passed }: { passed: boolean }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-3 items-center p-6 rounded-2xl",
        passed
          ? "bg-green-100 border-2 border-green-300"
          : "bg-red-100 border-2 border-red-300"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full",
          passed ? "bg-green-500" : "bg-red-500"
        )}
      >
        <img
          src={passed ? "/icons/check.svg" : "/icons/warning.svg"}
          alt={passed ? "pass" : "fail"}
          className="size-6 brightness-0 invert"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p
          className={cn(
            "text-2xl font-bold",
            passed ? "text-green-700" : "text-red-700"
          )}
        >
          {passed ? "Would Advance to Next Stage" : "Would Likely Be Skipped"}
        </p>
        <p
          className={cn("text-sm", passed ? "text-green-600" : "text-red-600")}
        >
          {passed
            ? "Based on the quick HR scan, this resume would make it to the 'consider' pile."
            : "Based on the quick HR scan, this resume would likely be passed over. See tips above to improve."}
        </p>
      </div>
    </div>
  );
};

const KeyInfoBadges = ({ items }: { items: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((item, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const HRReview = ({ feedback }: { feedback: HRReviewFeedback }) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Overall Score Summary */}
      <div className="flex flex-col gap-4 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
        <div className="flex flex-row items-center gap-4">
          <div className="text-5xl font-bold text-purple-700">
            {feedback.overallScore}
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-semibold text-gray-800">
              HR Quick Review Score
            </p>
            <p className="text-sm text-gray-500">
              Based on a 6-10 second recruiter scan
            </p>
          </div>
        </div>
      </div>

      {/* Pass/Fail Indicator */}
      <PassIndicator passed={feedback.passWouldMove} />

      {/* Detailed Categories */}
      <Accordion>
        <AccordionItem id="first-impression">
          <AccordionHeader itemId="first-impression">
            <CategoryHeader
              title="First Impression"
              categoryScore={feedback.firstImpression.score}
              subtitle={feedback.firstImpression.timeEstimate}
            />
          </AccordionHeader>
          <AccordionContent itemId="first-impression">
            <CategoryContent tips={feedback.firstImpression.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="visual-hierarchy">
          <AccordionHeader itemId="visual-hierarchy">
            <CategoryHeader
              title="Visual Hierarchy"
              categoryScore={feedback.visualHierarchy.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="visual-hierarchy">
            <CategoryContent tips={feedback.visualHierarchy.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="scannability">
          <AccordionHeader itemId="scannability">
            <CategoryHeader
              title="Scannability"
              categoryScore={feedback.scannability.score}
              subtitle={`Scan path: ${feedback.scannability.scanPath}`}
            />
          </AccordionHeader>
          <AccordionContent itemId="scannability">
            <CategoryContent tips={feedback.scannability.tips} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem id="key-information">
          <AccordionHeader itemId="key-information">
            <CategoryHeader
              title="Key Information"
              categoryScore={feedback.keyInformation.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="key-information">
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm font-medium text-blue-700 mb-2">
                  What stood out in the first 6 seconds:
                </p>
                <KeyInfoBadges items={feedback.keyInformation.foundInSeconds} />
              </div>
              <CategoryContent tips={feedback.keyInformation.tips} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default HRReview;
