
#  Blog Platform

A full-featured blogging platform built with **React**, **Vite**, **Tailwind CSS**, and **Firebase**. Users can create, publish, and manage blog posts, while visitors can read and comment on articles. The platform includes a user-specific admin dashboard, real-time updates via Firestore, and an **AI-powered content generation** feature using the **Google Gemini API**.

---

##  Features

-  **User Authentication** – Secure sign-up and login with Firebase Authentication (Email/Password).
-  **Admin Dashboard** – Manage your own posts and comments privately.
-  **AI Content Generation** – Generate blog content with Google Gemini API integration.
-  **Real-time Data** – Live blog and comment updates via Firestore `onSnapshot`.
-  **Rich Text Editor** – WYSIWYG editing powered by Quill.js.
-  **Search & Filtering** – Debounced search input and category filters.
-  **Pagination** – Efficient rendering for large post lists.
-  **Responsive Design** – Tailwind CSS ensures a great experience on all devices.
-  **Firestore Security Rules** – Fine-grained access control for user-generated content.

---

##  Technology Stack

- **Frontend:** React, Vite  
- **Styling:** Tailwind CSS  
- **State Management:** React `useState`, `useContext` (custom `AuthProvider`)  
- **Database:** Firebase Firestore  
- **Authentication:** Firebase Authentication  
- **AI Integration:** Google Gemini API  
- **Rich Text Editor:** Quill.js

---

## 📁 Project Structure

```

/
 blog-platform
├── .gitignore
├── README.md
├── package.json
├── vite.config.js
├── eslint.config.js
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   │   ├── assets.js
│   │   ├── logo.svg
│   │   ├── gradientBackground.png
│   │   └── ...                 # Other icons and image assets
│   ├── components/
│   │   ├── BlogCard.jsx
│   │   ├── BlogList.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   ├── NewsLetter.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   ├── SkeletonLoader.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Sidebar.jsx
│   │       └── Signup.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── BlogDetail.jsx
│   │   ├── Home.jsx
│   │   └── admin/
│   │       ├── AddBlog.jsx
│   │       ├── Comments.jsx
│   │       ├── DashBoard.jsx
│   │       ├── Layout.jsx
│   │       └── ListBlog.jsx
│   └── services/
│       ├── blogService.js
│       └── commentService.js

````

---

## ⚙️ Setup and Installation

### 1. Clone the Repository

```bash
git clone <repository_url>
cd blog-platform
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database** and **Authentication (Email/Password)**.
3. In **Project Settings > Your Apps**, create a new **Web App** and copy the `firebaseConfig`.
4. Add the config to `src/firebase/config.js`:

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---

### 4. Set Up Gemini API

1. Create a project in **Google AI Studio** or **Google Cloud Console**.
2. Generate a Gemini API key.
3. In your root directory, create a `.env` file:

```bash
VITE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

> **Note:** Use the `VITE_` prefix so that Vite exposes the variable to the frontend.

---

### 5. Configure Firestore Security Rules

Go to **Firestore > Rules** in the Firebase Console and replace them with:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Blog documents
    match /blogs/{blogId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;

      // Blog comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      }
    }
  }
}
```

Click **Publish**.

---

### 6. Create Firestore Indexes

Create a composite index for performance:

* **Collection:** `blogs`
* **Fields:** `userId`, `createdAt`

(Adjust fields depending on your queries in `BlogList.jsx`.)

---

### 7. Run the Application

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🤝 Contributing

Contributions are welcome!
Please open an issue or submit a pull request for features, fixes, or improvements.

---

## 📄 License

Specify your license here (e.g., MIT).
Don’t forget to include a `LICENSE` file in the repo.

---

