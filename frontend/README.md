# Micro-Kanban Task Manager

A lightweight, full-stack Micro-Kanban web application built to master decoupled architecture, React state management, and asynchronous REST API integration. This project features a responsive React user interface powered by Vite, communicating seamlessly with a persistent Python Flask backend and an SQLite3 database.

---

## 🏗️ Architecture & Data Pipeline Overview

The application is fully decoupled, dividing responsibilities cleanly between frontend presentation, backend business logic, and persistent storage layers:


1. Frontend Presentation (React + Vite): Handles user interaction, coordinates application lifecycle events using useEffect, and dynamically manages interface states via useState without requiring page refreshes.

2. Backend Gateway (Flask REST API): Acts as a secure, structured routing engine. It intercepts incoming network streams, enforces CORS access permissions, maps parameter types, and manages connections to the database layer.

3. Storage Engine (SQLite3): A relational file-based storage layout utilizing an autoincrementing index pattern. It leverages specialized cursor properties (cursor.lastrowid) to guarantee structural integrity and identity synchronization back to the frontend.

🛠️ Tech Stack & Dependencies
Frontend
React 18 (UI Component Library)

Vite (Next-generation, ultra-fast frontend tooling)

JavaScript (ES6+) / JSX

Backend
Python 3

Flask (Micro web framework)

Flask-CORS (Cross-Origin Resource Sharing handler)

SQLite3 (Lightweight SQL Database engine)

Pylint (Code quality and PEP 8 structural integrity monitoring)

🚀 Getting Started & Installation
To run this project locally on your system, you must boot up both the Flask backend environment and the Vite frontend dev server simultaneously in separate terminal windows.

Prerequisites
Python 3.x installed

Node.js (including npm) installed
