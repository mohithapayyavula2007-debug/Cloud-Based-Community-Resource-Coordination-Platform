# React + TypeScript + Vite

A modern frontend project built using **React, TypeScript, and Vite**. It provides a fast development environment with **Hot Module Replacement (HMR)** and **ESLint** support.

## 🚀 Features

* ⚛️ React for building interactive user interfaces
* 🔷 TypeScript for type-safe development
* ⚡ Vite for fast development and production builds
* 🔄 Hot Module Replacement (HMR)
* 🔍 ESLint for code quality
* 🔥 Fast Refresh using Babel or SWC

## 🛠️ Technologies Used

* **React**
* **TypeScript**
* **Vite**
* **ESLint**
* **Babel / SWC**

## 📦 React Plugins

This project supports two official React plugins:

* `@vitejs/plugin-react` – Uses Babel for Fast Refresh.
* `@vitejs/plugin-react-swc` – Uses SWC for Fast Refresh.

## ⚙️ Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project folder:

```bash
cd YOUR_PROJECT_NAME
```

Install dependencies:

```bash
npm install
```

## ▶️ Run the Project

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 🏗️ Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🔍 ESLint Configuration

ESLint is included to maintain code quality. For production applications, TypeScript-aware rules can be enabled using:

* `recommendedTypeChecked`
* `strictTypeChecked`
* `stylisticTypeChecked`

React-specific rules can also be added using:

* `eslint-plugin-react-x`
* `eslint-plugin-react-dom`

## 🧠 React Compiler

The React Compiler is **not enabled by default** because it may affect development and build performance. It can be enabled later when required.

## 📂 Project Structure

```text
project/
├── public/
├── src/
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── vite.config.ts
└── README.md
```

## 🎯 Purpose

This project provides a simple and efficient starting point for developing **modern, fast, and type-safe React applications**.

## 👩‍💻 Author

**Mohitha Payyavula**

---

⭐ **If you find this project useful, please consider giving the repository a star!**
