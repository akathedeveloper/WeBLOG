# WeBlog

WeBlog is a modern blogging application built using **React**, **Express**, and **MongoDB**. It provides users with an intuitive platform to create, manage, and explore blog posts across various categories.

---

## Features

- **JWT Authentication**: Secure user login and registration.
- **Post Management**: Create, edit, update, and delete posts with ease.
- **Categories**: Explore posts across categories like Agriculture, Technology, and more.
- **Author-Specific Posts**: View all posts by a specific author.
- **Image Support**: Upload and display images within posts.

---

## Tech Stack

- **Frontend**: React
- **Backend**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

---

## Installation

Follow the steps below to set up the project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/weblog.git
cd weblog
```

### 2. Install Dependencies

#### For the Backend:
```bash
cd backend
npm install
```

#### For the Frontend:
```bash
cd frontend
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 4. Start the Application

#### Start the Backend Server:
```bash
cd backend
npm start
```

#### Start the Frontend Development Server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`.

---

## Usage

1. **Register/Login**: Create an account or log in with your credentials.
2. **Create a Post**: Use the editor to create and publish a blog post.
3. **Explore Categories**: Navigate through various categories to explore posts.
4. **Manage Posts**: Edit or delete your posts as needed.
5. **View Author Posts**: Click on an author’s name to see all their posts.

---

## Folder Structure

```
weblog/
├── backend/           # Express backend
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── controllers/   # Logic for route handling
│   └── server.js      # Main server file
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # React pages
│   │   ├── utils/      # Helper functions
│   │   └── App.js      # Main App file
└── README.md          # Project documentation
```

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature-name'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements

- **React**: For the powerful frontend framework.
- **Express**: For the robust backend framework.
- **MongoDB**: For the scalable database.
- **JWT**: For secure authentication.
