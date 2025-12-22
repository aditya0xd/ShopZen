🛒 ShopZen

ShopZen is a modern e-commerce frontend built with React, TypeScript, and Vite, focused on smooth product discovery using debounced search and infinite scrolling.

The project demonstrates real-world frontend patterns such as controlled pagination, IntersectionObserver-based infinite loading, and optimized async data handling.

✨ Features

🔍 Debounced Search
Prevents excessive API calls while typing for a smoother UX.

♾️ Infinite Scroll
Loads products progressively using the IntersectionObserver API.

⚡ Optimized Fetching
Handles pagination, avoids duplicate requests, and prevents UI glitches during fast scrolling.

🎨 Responsive UI
Clean, mobile-friendly layout with Tailwind CSS.

🌗 Dark Mode Ready
Styled with Tailwind’s dark mode support.

🧠 Technical Highlights

Server-side pagination using DummyJSON API

Debounced input handling with a custom hook

IntersectionObserver for scroll-based loading

Careful state management to avoid:

duplicate products

race conditions

scroll jitter

Written fully in TypeScript

🛠️ Tech Stack

React

TypeScript

Vite

Tailwind CSS

IntersectionObserver API

🚀 Getting Started

1. Clone the repository
   git clone https://github.com/aditya0xd/ShopZen.git
   cd shopzen

2. Install dependencies
   npm install

3. Start the development server
   npm run dev

The app will be available at:

http://localhost:5173

📁 Project Structure (simplified)
src/
├── components/
│ ├── product/
│ └── common/
├── hooks/
│ └── useDebounce.ts
├── pages/
│ └── Products.tsx
├── types/
└── App.tsx

📌 Future Improvements

Category-based filtering

Client-side caching

Skeleton optimization

Improved accessibility

Backend integration

👤 Author

Aditya Yadav
Frontend-focused developer exploring scalable UI patterns with React and TypeScript.

⭐ If you found this useful

Feel free to star the repository — it helps a lot!
