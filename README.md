# 🏙️ Fiscal: Build a city with your savings!

### Ever wished managing your budget was as fun as playing SimCity? Now it is.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

---

![Fiscal City Demo GIF](https://your-link-to-a-cool-project-demo.gif)

## ✨ What is This?

**Fiscal City** is an experimental project that transforms the mundane task of personal budgeting into an interactive, 3D city-building experience. Instead of staring at spreadsheets, you can watch your savings grow into a sprawling metropolis.

-   **Track an Expense:** A new house or a small shop appears.
-   **Log Your Paycheck:** Watch a skyscraper rise into the clouds.
-   **Meet a Savings Goal:** Unlock a special monument or a beautiful park.

This project merges a full-stack budget tracker with a 3D city simulator, proving that financial management can be visual, motivating, and fun.

## 🚀 Key Features

-   **Visual Finance:** See your financial transactions come to life as 3D buildings and infrastructure.
-   **Interactive 3D Canvas:** Pan, zoom, and explore the city you've built with your own financial habits, powered by Three.js.
-   **Full-Stack Budgeting:** A robust backend built with Next.js and Prisma handles all your financial data securely.
-   **Data Persistence:** Your city is saved and grows with you over time, thanks to a persistent SQLite database.
-   **Modern & Sleek UI:** A clean interface built with Tailwind CSS and Shadcn/ui makes managing your budget a breeze.

## 🛠️ Tech Stack

This project was built using a modern, type-safe stack:

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **3D Rendering:** [Three.js](https://threejs.org/) (ported from JavaScript to TypeScript for this project)
-   **ORM:** [Prisma](https://www.prisma.io/)
-   **Database:** [SQLite](https://www.sqlite.org/index.html)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

## ⚙️ Getting Started

Want to run your own Fiscal City? Follow these steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BenjaminTham/Budget-Tracker.git
    cd budget-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install, or pnpm install
    ```

3.  **Set up the database:**
    Prisma uses a `.env` file to store the database URL. Create one from the example:
    ```bash
    cp .env.example .env
    ```
    Then, run the database migrations:
    ```bash
    npx prisma migrate dev
    ```
    This will set up the SQLite database and generate the Prisma Client.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser and start building your city!

## 🗺️ Future Roadmap

This project is a living experiment. Here are some ideas for the future:

-   [ ] **Categorized Buildings:** Different building models based on expense categories (e.g., restaurants for food, stadiums for entertainment).
-   [ ] **Financial Disasters:** Visual events for overspending, like a storm or a building turning red.
-   [ ] **"City Hall" Dashboard:** Click on a central building to see detailed financial charts and analytics.
-   [ ] **Multi-User Support:** Allow users to create accounts and manage their own private cities.

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE). Feel free to fork, modify, and use it as you see fit.
