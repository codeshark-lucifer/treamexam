# TreamExam - Online Assessment Platform

TreamExam is a high-performance, modern online examination and assessment platform built with Next.js 16 and Firebase. It provides a seamless experience for students to take exams and a comprehensive dashboard for administrators to manage content and track performance.

---

## 🏗️ System Architecture

The project follows a **Server-Side First** architecture using Next.js App Router, ensuring high security and fast initial load times.

### 1. Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend/Auth**: Firebase Admin SDK (Server) & Firebase Client SDK
- **Databases**: 
    - **Cloud Firestore**: For dynamic user data, results, and tracking.
    *   **Realtime Database (RTDB)**: For static exam content (Categories, Exams, Questions).

---

## 📊 Data Schema & Storage

We use a dual-database approach to optimize for speed and scalability.

### 1. Realtime Database (Content Storage)
Used for data that needs to be fetched quickly and rarely changes its structure.
- **`data/categories`**: Stores exam categories (e.g., Science, Culture).
- **`data/exams`**: Stores specific exam titles linked to categories.
- **`data/questions`**: Stores the actual questions, options, and correct answers.

### 2. Cloud Firestore (User & Dynamic Data)
Used for relational-like data that requires complex querying and high security.
- **`users` Collection**: 
    - `uid`: Unique identifier.
    - `role`: "admin" or "user".
    - `streak`: Current consecutive days of activity.
    - `totalScore`: Aggregated score across all exams.
    - `updatedAt`: Last activity timestamp.
- **`results` Collection**:
    - `userId`: Link to the user.
    - `examTypeId`: Which exam was taken.
    - `score`: Percentage achieved.
    - `timestamp`: When the exam was submitted.
    - `answers`: Detailed array of user choices vs correct answers.

---

## 🛠️ Project Modules

### 1. Authentication (`lib/auth`)
Uses Firebase Session Cookies for persistent, secure login. Roles (Admin/User) are verified on every server-side request to prevent unauthorized access.

### 2. User Dashboard (`app/(dashboard)/user`)
A personalized space for students to track their progress, see their exam history (Recent Activity), and monitor their learning streaks.

### 3. Admin Dashboard (`app/(dashboard)/admin`)
A centralized control center for platform management:
- **Real-time Stats**: Total users, attempts, and content library size.
- **Management Actions**: Quick links to User Management, Exam Catalog, and Analytics.
- **Reporting**: Ability to export recent system data to CSV for offline analysis.

### 4. Exam Interface (`app/(dashboard)/category/...`)
A clean, focused interface for taking assessments, with real-time scoring and instant feedback upon submission.

---

## 📂 Core Folder Structure

```text
├── app/                  # Next.js App Router (Routes & Layouts)
│   ├── (dashboard)/      # Protected routes (Admin & User)
│   ├── api/              # Backend API endpoints
│   └── auth/             # Login & Registration pages
├── components/           # Reusable UI components (Cards, Buttons, Charts)
├── lib/                  # Core logic
│   ├── auth/             # Session management & Role checking
│   ├── firebase-admin.ts # Server-side Firebase (Full Access)
│   └── firebase-client.ts# Client-side Firebase (Limited Access)
└── public/               # Static assets (Images, Icons)
```

---

## 🚀 Key Features for Developers
- **Security**: Admin actions are protected by server-side middleware and Firestore security rules.
- **Performance**: Heavy data fetching is handled in parallel using `Promise.all`.
- **Reliability**: Custom error handling for Firebase initialization and data serialization.
- **Exportable Data**: Built-in CSV export utility for administrative reporting.
