# Database Documentation & Security Rules

This document outlines the data structure and security rules for **TreamExam**.

## 1. Firebase Realtime Database (RTDB)
Used for static/content data like categories, exams, and questions.

### Schema
```json
{
  "data": {
    "categories": {
      "cat_id_1": {
        "id": "cat_id_1",
        "name": "General Science",
        "description": "Fundamental science questions"
      }
    },
    "exams": {
      "exam_id_1": {
        "id": "exam_id_1",
        "categoryId": "cat_id_1",
        "name": "Mixed Biology",
        "description": "Biology questions covering various topics"
      }
    },
    "questions": {
      "q_id_1": {
        "id": "q_id_1",
        "categoryId": "cat_id_1",
        "examType": "exam_id_1",
        "question": "What is the powerhouse of the cell?",
        "options": ["Nucleus", "Ribosome", "Mitochondria", "Golgi Body"],
        "correctAnswer": "Mitochondria"
      }
    }
  }
}
```

### Security Rules
Copy and paste these into your **Realtime Database > Rules** tab:
```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "data": {
      ".read": "auth != null",
      "categories": {
        ".indexOn": ["id"]
      },
      "exams": {
        ".indexOn": ["categoryId"]
      },
      "questions": {
        ".indexOn": ["categoryId", "examType"]
      }
    }
  }
}
```

---

## 2. Cloud Firestore
Used for dynamic user data, session results, and statistics.

### Collections

#### `users` (Collection)
- **Document ID:** `{userId}`
- **Fields:**
  - `firstName`: string
  - `lastName`: string
  - `displayName`: string
  - `role`: "user" | "admin"
  - `totalExams`: number
  - `totalScore`: number
  - `streak`: number
  - `lastExamAt`: timestamp
  - `updatedAt`: timestamp

#### `results` (Collection)
- **Document ID:** auto-generated
- **Fields:**
  - `userId`: string
  - `categoryId`: string
  - `examTypeId`: string
  - `score`: number
  - `timestamp`: timestamp
  - `answers`: array of objects
    - `questionId`: string
    - `selected`: string
    - `correct`: string
    - `isCorrect`: boolean

### Security Rules
Copy and paste these into your **Firestore > Rules** tab:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      // Writing usually handled by admin SDK in API routes for security, 
      // but if you want client-side updates:
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to see their own results
    match /results/{resultId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Admin full access
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Required Indexes
To support the dashboard sorting, ensure you have this composite index created:
- **Collection:** `results`
- **Fields:** `userId` (Ascending), `timestamp` (Descending)
