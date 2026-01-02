# 🛒 ShopZen — Performance-Focused E-commerce Frontend

ShopZen is a production-style e-commerce frontend built with **React, TypeScript, and Vite**, designed to demonstrate how modern UIs behave under **real user interaction**—fast scrolling, rapid input, and async edge cases.

Instead of being feature-heavy, ShopZen focuses on **frontend engineering decisions** that prevent UI glitches, redundant requests, and inconsistent state.

---

## 🎯 What This Project Demonstrates

- Controlled API usage (no unnecessary calls)
- Stable infinite scrolling without duplicate data
- Predictable UX for loading, error, and empty states
- Defensive state management under async conditions

---

## ✨ Key Features

### 🔍 Debounced Search

Prevents excessive API calls during fast typing and avoids UI jitter.

### ♾️ Infinite Scrolling

IntersectionObserver-based pagination (no scroll listeners).

### ⚡ Safe Async Fetching

Handles pagination correctly, avoids race conditions and duplicate requests.

### 🎨 Responsive UI + Dark Mode

Built with Tailwind CSS and fully mobile-friendly.

### 🛒 Cart UX Guards

Prevents duplicate additions and provides clear user feedback.

---

## 🧠 Engineering Highlights

- Server-side pagination using DummyJSON API
- Custom debouncing hook for input control
- IntersectionObserver for scroll-based loading
- Skeleton loaders aligned with final layout (no CLS)
- Fully typed with TypeScript

---

## 🛠 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- IntersectionObserver API

---

## 🚀 Getting Started

```bash
git clone https://github.com/aditya0xd/ShopZen.git
cd ShopZen
npm install
npm run dev
```

## 🔗 Live Demo

👉 https://shop-zen-ten.vercel.app/

---

## 📁 Project Structure (Simplified)

```txt
src/
├── components/
│   ├── product/
│   └── common/
├── hooks/
│   └── useDebounce.ts
├── pages/
│   ├── Products.tsx
│   └── ProductDetails.tsx
├── context/
├── types/
└── App.tsx
```

## 📌 Planned Enhancements

- Category-based filtering

- Client-side caching

- Accessibility improvements

- Persistent cart storage

- Backend integration

## 👤 Author

Aditya Yadav
Full-Stack developer
