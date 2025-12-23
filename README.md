🛒 ShopZen

ShopZen is a production-style e-commerce frontend built with React, TypeScript, and Vite, focused on performance, UX stability, and real-world frontend challenges like infinite scrolling, async race conditions, and state consistency.

Rather than being feature-heavy, ShopZen emphasizes how modern frontends should behave under real user interaction.

🎯 Why ShopZen?

Most demo e-commerce projects focus on UI only.
ShopZen focuses on engineering decisions behind a smooth browsing experience:

Preventing unnecessary API calls

Handling fast scrolling without glitches

Avoiding duplicate data and inconsistent UI states

Designing predictable UX for loading, error, and empty states

✨ Features

🔍 Debounced Search
Reduces API load and prevents jittery UI during fast typing.

♾️ Infinite Scrolling
Uses the IntersectionObserver API for efficient, scroll-based pagination.

⚡ Optimized Fetching
Handles pagination safely, avoids duplicate requests, and prevents race conditions.

🎨 Responsive UI
Clean, mobile-friendly layout built with Tailwind CSS.

🌗 Dark Mode Support
Fully styled using Tailwind’s dark mode utilities.

🛒 Cart UX Improvements
Prevents duplicate additions and provides clear user feedback.

🧠 Engineering Highlights

Server-side pagination via DummyJSON API

Custom hook for debounced input handling

IntersectionObserver-based loading (no scroll listeners)

Defensive state management to avoid:

duplicate products

race conditions

scroll jitter & flicker

Skeleton loaders aligned with final layouts (no CLS)

Fully written in TypeScript

🛠️ Tech Stack

React

TypeScript

Vite

Tailwind CSS

IntersectionObserver API

🚀 Getting Started
git clone https://github.com/aditya0xd/ShopZen.git
cd ShopZen
npm install
npm run dev

Live demo:
👉 https://shop-zen-ten.vercel.app/

📁 Project Structure (simplified)
src/
├── components/
│ ├── product/
│ └── common/
├── hooks/
│ └── useDebounce.ts
├── pages/
│ ├── Products.tsx
│ └── ProductDetails.tsx
├── context/
├── types/
└── App.tsx

📌 Future Improvements

Category-based filtering

Client-side caching

Accessibility improvements

Persistent cart storage

Backend integration

👤 Author

Aditya Yadav
Frontend-focused developer interested in scalable UI patterns, performance optimization, and real-world React behavior.

⭐ If you found this useful
Consider starring the repository — it really helps!
