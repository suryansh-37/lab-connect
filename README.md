# LabConnect

A web application for teacher and student interaction, similar to Google Classroom. It provides a shared space for classes, combining assignment tracking, messaging, and live online sessions.

## Features

* **Student & Teacher Views:** Separate dashboards with tools specific to each role.
* **Group Chat:** Text messaging for classroom discussions and quick questions.
* **Video Calls:** Built-in video feature for online lectures and lab sessions.
* **Assignments:** Teachers can post tasks, and students can upload their completed work.
* **Resource Library:** A section to upload and download study materials.
* **Attendance:** Tools for teachers to track who is present during active sessions.

## Tech Stack

* **Frontend:** React.js, Vite
* **Backend:** Node.js, Express.js (server.js)
* **Database:** MongoDB (Mongoose models)

## Setup Instructions

Follow these steps to run the project locally.

### Prerequisites

* [Node.js](https://nodejs.org/) installed
* [Git](https://git-scm.com/) installed
* A local MongoDB instance or a MongoDB Atlas account

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
   cd your-repo-name
2. **Install Dependencies**
    ```bash 
    npm install

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your database credentials and API keys. 
   *(Note: .env is in .gitignore, so it won't be pushed to GitHub)*
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000

4. **Run the app**
    ```bash
    npm run dev