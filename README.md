## Backend Repo

https://github.com/ayush-3393/thinkle-backend

---

## Demo

https://github.com/user-attachments/assets/a29562da-961f-4885-9d0b-132cc01257e7

---

# Thinkle 🎯 – A Smarter Word Guessing Game

## 🧠 About

**Thinkle** is a word-guessing game inspired by _Wordle_, but with a twist!

- You have **10 lives** to guess the word of the day.
- You can request **up to 2 hints**, each costing **3 lives**.
- Every incorrect guess costs **1 life**.
- Each guess is met with feedback from an **AI Oracle**, offering playful and insightful commentary.

---

## 🛠 Technologies Used

### Frontend

- **React 19.1.0** - Modern JavaScript library for building user interfaces
- **TypeScript 4.9.5** - Typed superset of JavaScript for better development experience
- **React Router DOM 7.7.0** - Declarative routing for React applications
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **PostCSS** - Tool for transforming CSS with JavaScript plugins
- **Autoprefixer** - CSS vendor prefixing

### UI/UX Libraries

- **Lucide React 0.525.0** - Beautiful & consistent icon library
- **Custom CSS** - Hand-crafted animations and styling

### Development & Testing

- **React Scripts 5.0.1** - Configuration and scripts for Create React App
- **Jest** - JavaScript testing framework
- **React Testing Library** - Testing utilities for React components
- **ESLint** - Static code analysis tool
- **Web Vitals** - Library for measuring web performance metrics

### Backend Integration

- **RESTful APIs** - Communication with Spring Boot backend
- **JWT Authentication** - Secure token-based authentication
- **Error Handling** - Comprehensive error boundary implementation

### Build & Deployment

- **Create React App** - Toolchain for React application development
- **ES5 Target Compilation** - Broad browser compatibility
- **Modern ES Modules** - Efficient code bundling and tree shaking

---

## 🚀 Features

### 🔐 Authentication

- Secure **Signup/Login** using **Spring Security** and **JWT tokens**
- JWT tokens expire after **24 hours**

---

### 🕹 Game Sessions

- A **new session** is created on the user's first login of the day
- Unfinished sessions are **resumed** on next login
- A single **Word of the Day** is generated for all users once per day
- All hints are generated and stored at the time of word generation

---

### 🔤 Word Generation

- Only **one unique word** is generated per day
- The word is generated via **Google Gemini AI**

---

### 💡 Hints

- Players can request **up to 2 hints** to assist with guessing
- Hints are pre-generated using **Gemini AI** and stored in the database
- Each hint usage costs **3 lives**
- Hints are **fetched from the database**, not re-generated

---

### 🎯 Guesses & AI Feedback

- Players can guess **5-letter words**
- The **AI Oracle** provides witty feedback on each guess
- The board shows:
  - 🟩 Correct letters in the correct position
  - 🟨 Correct letters in the wrong position

---

Enjoy Thinkle, where guessing meets AI-powered fun! 🚀

---
