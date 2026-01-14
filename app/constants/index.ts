export const resumes: Resume[] = [
  {
    id: "1",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume_01.pdf",
    analysisType: "job-specific",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "2",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume_02.pdf",
    analysisType: "job-specific",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "3",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume_03.pdf",
    analysisType: "job-specific",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "4",
    companyName: "Google",
    jobTitle: "Frontend Developer",
    imagePath: "/images/resume_01.png",
    resumePath: "/resumes/resume_01.pdf",
    analysisType: "job-specific",
    feedback: {
      overallScore: 85,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "5",
    companyName: "Microsoft",
    jobTitle: "Cloud Engineer",
    imagePath: "/images/resume_02.png",
    resumePath: "/resumes/resume_02.pdf",
    analysisType: "job-specific",
    feedback: {
      overallScore: 55,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
  {
    id: "6",
    companyName: "Apple",
    jobTitle: "iOS Developer",
    imagePath: "/images/resume_03.png",
    resumePath: "/resumes/resume_03.pdf",
    analysisType: "job-specific",
    feedback: {
      overallScore: 75,
      ATS: {
        score: 90,
        tips: [],
      },
      toneAndStyle: {
        score: 90,
        tips: [],
      },
      content: {
        score: 90,
        tips: [],
      },
      structure: {
        score: 90,
        tips: [],
      },
      skills: {
        score: 90,
        tips: [],
      },
    },
  },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription}
  Provide the feedback using the following format: ${AIResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;

export const HRReviewResponseFormat = `
interface HRReviewFeedback {
  overallScore: number; // max 100 - overall resume quality from HR perspective
  firstImpression: {
    score: number; // max 100 - how professional does it look at first glance?
    timeEstimate: string; // e.g., "Would spend 8+ seconds", "Would skip in 3 seconds"
    tips: {
      type: "good" | "improve";
      tip: string; // short title
      explanation: string; // detailed explanation
    }[]; // give 3-4 tips
  };
  visualHierarchy: {
    score: number; // max 100 - are sections clearly defined? good whitespace?
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[]; // give 3-4 tips
  };
  scannability: {
    score: number; // max 100 - can HR quickly find key information?
    scanPath: string; // describe what HR's eyes would follow, e.g., "Name → Current Title → Company Names → Skills section"
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[]; // give 3-4 tips
  };
  keyInformation: {
    score: number; // max 100 - is critical info prominent and easy to find?
    foundInSeconds: string[]; // list what HR would notice in first 6 seconds, e.g., ["Software Engineer at Google", "5+ years experience", "Python, React skills"]
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[]; // give 3-4 tips
  };
  passWouldMove: boolean; // Would this resume make it to the "consider" pile?
}`;

export const prepareHRReviewInstructions = () =>
  `You are an experienced HR recruiter who has reviewed thousands of resumes.
  You typically spend only 6-10 seconds on an initial resume scan before deciding to read further or move on.
  
  Analyze this resume AS IF you are doing a quick initial scan. Be honest and critical - recruiters are busy and quick to reject.
  
  Focus on these key areas:
  
  1. FIRST IMPRESSION (2-3 seconds)
     - Does it look professional at a glance?
     - Is the layout clean and modern?
     - Are there any immediate red flags (cluttered, too long, poor formatting)?
  
  2. VISUAL HIERARCHY
     - Are sections clearly defined with headers?
     - Is there good use of whitespace?
     - Is the font readable and consistent?
     - Does the design guide the eye naturally?
  
  3. SCANNABILITY
     - Can you quickly identify who this person is and what they do?
     - Are bullet points concise and easy to scan?
     - Is information density appropriate (not too sparse, not overwhelming)?
  
  4. KEY INFORMATION PROMINENCE
     - In the first 6 seconds, what stands out? (Name, current role, key skills?)
     - Is contact information easy to find?
     - Are the most impressive achievements visible without deep reading?
  
  5. PASS OR SKIP DECISION
     - Based on your quick scan, would you move this resume to the "consider" pile or skip it?
     - Be honest - most resumes get rejected in the first scan.
  
  Rate each category honestly. If the resume is poor, give low scores. This helps the user improve.
  
  Provide the feedback using the following format: ${HRReviewResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;

export const ImprovementResponseFormat = `
interface ImprovedContent {
  sections: {
    category: string; // e.g., "Tone & Style", "Content", "Structure", "Skills"
    originalIssue: string; // the tip that was flagged for improvement
    improvedText: string; // suggested improved text/content
  }[];
  summary: string; // brief summary of all improvements made
}`;

export const prepareImprovementInstructions = (
  improveTips: { category: string; tip: string; explanation: string }[]
) => {
  const tipsFormatted = improveTips
    .map((t) => `- ${t.category}: ${t.tip} - ${t.explanation}`)
    .join("\n");

  return `You are an expert CV/resume writer helping to improve a resume.
  
Based on the following feedback that flagged areas for improvement, provide specific improved text for each issue:

AREAS TO IMPROVE:
${tipsFormatted}

For each area:
1. Look at the original resume content
2. Rewrite or improve that specific section
3. Provide professional, impactful text that addresses the feedback

Be specific and provide actual text the user can copy-paste into their resume.
Focus on action verbs, quantifiable achievements, and professional language.

Return the improvements using this format: ${ImprovementResponseFormat}
Return as JSON only, no other text or backticks.`;
};
