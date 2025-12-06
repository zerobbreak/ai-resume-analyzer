# AI Resume Analyzer

A modern, AI-powered application that helps job seekers improve their resumes. It allows users to upload PDF resumes, which are then analyzed by AI to provide detailed feedback, ATS scores, and actionable improvement tips.

## 🚀 Features

- **AI-Powered Analysis**: Uses advanced AI models (via Puter.js) to analyze resume content.
- **Comprehensive Feedback**:
  - **ATS Score**: Evaluates how well the resume parses for Applicant Tracking Systems.
  - **Category Breakdown**: detailed analysis of Tone & Style, Content, Structure, and Skills.
  - **Actionable Tips**: Specific "Good" and "Improve" suggestions for each category.
- **PDF Handling**: Automatically converts uploaded PDFs to images for preview.
- **User Dashboard**: Track and manage previously uploaded resumes with their scores.
- **Authentication**: Secure user accounts managed by Puter.js.
- **Cloud Storage**: Files and analysis data persisted securely in the cloud.

## 🛠️ Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/) (formerly Remix)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & `tw-animate-css`
- **Backend Services**: [Puter.js](https://docs.puter.com/)
  - Auth (Authentication)
  - AI (LLM Integration)
  - FS (File System)
  - KV (Key-Value Database)
- **State Management**: Zustand
- **PDF Processing**: `pdfjs-dist`

## 📦 Getting Started

### Prerequisites

This project is designed to run within the [Puter.com](https://puter.com) ecosystem or an environment where `puter.js` is available and configured.

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/ai-resume-analyzer.git
    cd ai-resume-analyzer
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```
app/
├── components/     # Reusable UI components (ResumeCard, Details, ATS, etc.)
├── constants/      # App constants and mock data
├── lib/            # Utilities and Puter store configuration
│   ├── puter.ts    # Puter.js integration & Zustand store
│   └── pdf2image.ts# PDF conversion logic
├── routes/         # Application routes (File-based routing)
│   ├── home.tsx    # Dashboard / Label page
│   ├── upload.tsx  # Resume upload & analysis page
│   ├── resume.tsx  # Individual resume details view
│   ├── auth.tsx    # Authentication page
│   └── wipe.tsx    # Utility route to clear app data
└── app.css         # Global styles & Tailwind configuration
```

## 🧹 Maintenance

A utility route `/wipe` is available to clear all application data (uploaded files and database records) during development.

---

Built with ❤️ using React Router and Puter.js.
