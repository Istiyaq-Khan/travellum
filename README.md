# Travellum 🌍✈️

> **Built for the Hackathon** 🚀  
> The intelligent, AI-powered travel companion that helps you explore the world safely and on budget.

![Travellum Hero](/hero.png)

## 📖 Introduction

Traveling is exciting, but planning can be overwhelming. "Is it safe?", "How much will it really cost?", "What should I know before I go?".

**Travellum** solves this by aggregating real-time data and using advanced AI to provide instant, comprehensive travel guides. It doesn't just list facts; it tells you a story, warns you of dangers, and helps you budget—all in seconds.

## 💡 The Story

### 🌟 Inspiration
The idea for Travellum came from a personal pain point. Last year, while planning a solo trip, I found myself with 20+ browser tabs open—Wikivoyage for sights, Numbeo for costs, government sites for safety warnings, and Reddit for "real" advice. It was exhausting. I realized there had to be a better way to get a holistic view of a destination instantly. I wanted to build something that didn't just dump data, but actually *guided* you like a knowledgeable expert.

### 💻 How I Built It
I built Travellum using the **Next.js 15 App Router** for a robust full-stack framework. 
*   **The Brain**: I integrated **Google Gemini 2.5 Flash** because of its large context window and speed. I engineered a complex prompt to force it to output strictly structured JSON, ensuring the UI never breaks.
*   **The Voice**: For the audio guides, I built a pipeline using **Edge TTS** (running in a Python shell via `child_process`). This generates high-quality neural speech without the expensive API costs of other providers.
*   **The Memory**: To make it blazing fast, I implemented a "read-through" caching strategy. Generated data is stored in **MongoDB** and audio files in **Firebase Storage**.

### 🛑 Challenges I Faced
*   **Structured AI Output**: Getting the LLM to consistently output valid JSON without markdown formatting or hallucinations took several iterations of prompt engineering.
*   **Vercel Timeouts**: The audio generation process (generating text -> converting to audio -> uploading to Firebase) initially exceeded serverless function timeouts. I optimized this by using lightweight raw audio buffers and parallelizing the upload/database operations.
*   **Cost Management**: I worried about API costs for a public demo. I solved this by implementing the "Double-Caching" layer, ensuring that we never generate the same country's data twice.

### 🧠 What I Learned
Building Travellum taught me that **latency is the enemy of UX**. Even with powerful AI, users won't wait 10 seconds. I learned how to mask these delays with optimistic UI updates and, more importantly, how powerful a simple caching layer can be. I also learned that "constraints breed creativity"—using free tools like Edge TTS forced me to build a more clever backend architecture than if I had just paid for an API.

## ✨ Key Features

- **🛡️ AI Safety Analysis**: Real-time safety scores (0-100) with detailed breakdowns for crime, LGBTQ+ safety, women's safety, and political stability.
- **🎧 Immersive Audio Guides**: Listen to generated history and safety advisories on the go. Perfect for when you're walking around a new city.
- **💰 Smart Budgeting**: Data-driven daily cost estimates for Budget, Medium, and Luxury travelers (including local currency).
- **⚡ Instant Caching**: The first user to search generates the data; every subsequent user gets it instantly from our global cache.
- **🎨 Premium UX**: A modern, dark-mode interface built with Framer Motion and Tailwind CSS.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop experiences.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: Next.js API Routes (Serverless)
- **Database**: 
  - [MongoDB](https://www.mongodb.com/): Stores structured country data and cache timestamps.
  - [Firebase Storage](https://firebase.google.com/): Stores generated audio files for efficient content delivery.
- **AI & ML**: 
  - **Google Gemini 2.5 Flash**: The core intelligence engine generating comprehensive country insights and safety scores.
  - **Microsoft Edge TTS**: High-quality neural text-to-speech engine for generating audio guides.

## 🧠 How It Works (The "Secret Sauce")

Travellum is engineered for **High Performance and Low Cost**. We use a smart caching strategy to minimize API costs while delivering zero-latency results.

1.  **Request**: A user searches for a country (e.g., "Japan").
2.  **Check Cache**: We check MongoDB. If the data exists and is less than 7 days old, we return it instantly (0ms latency, $0 cost).
3.  **AI Generation (Miss)**: If not in cache:
    - We ask **Gemini 2.5 Flash** to generate a structured JSON guide.
    - We immediately save this to MongoDB for future users.
4.  **Audio Generation**: When a user clicks "Play Audio":
    - We check **Firebase Storage**. If the audio exists, we stream it directly.
    - If not, we generate it on-the-fly using **Edge TTS** (Python), upload it to Firebase, and then stream it.

**Result**: The more people use it, the faster and cheaper it becomes to run.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Database URI
- Firebase Service Account
- Google Gemini API Key

### Installation

1.  Clone the repo:
    ```bash
    git clone https://github.com/yourusername/travellum.git
    cd travellum
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables (`.env.local`):
    Create a `.env.local` file in the root directory:
    ```env
    # Firebase Configuration (Client-Side)

    NEXT_PUBLIC_FIREBASE_API_KEY=AIz.....
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=travellum-d.....
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=travellum-d.....
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=travellum-d.....
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1030.......
    NEXT_PUBLIC_FIREBASE_APP_ID=1:1030160........

    FIREBASE_CLIENT_EMAIL=firebase-admins.....
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\....\n-----END PRIVATE KEY-----\n"

    # MongoDB Configuration (Database)
    MONGODB_URI=mongod...........

    # AI Configuration (Server-Side)
    GOOGLE_GEMINI_API_KEY=AIzaS..............
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) within your browser.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License
