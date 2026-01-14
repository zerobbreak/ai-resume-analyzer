interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface HRReviewFeedback {
  overallScore: number;
  firstImpression: {
    score: number;
    timeEstimate: string;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  visualHierarchy: {
    score: number;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  scannability: {
    score: number;
    scanPath: string;
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  keyInformation: {
    score: number;
    foundInSeconds: string[];
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
  };
  passWouldMove: boolean;
}

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  analysisType: "job-specific" | "hr-review";
  feedback: Feedback | HRReviewFeedback;
}

interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}
