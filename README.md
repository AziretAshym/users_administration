# User Administration App 🚀

A simple yet powerful user management system built with modern web technologies.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Templating**: EJS
- **Environment**: dotenv

## 📦 Installation

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/AziretAshym/users_administration.git
   cd users_administration

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file
Create a .env file in the root directory. You can use the .env.example file as a reference:

```bash
cp .env.example .env
```
Then fill in your own values inside .env:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/user_administration
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### 4. Database Seeding (Optional)

To populate your database with sample users:
```
npm run seed
```

### 5. Start the application

```bash
npm run dev
```
Open your browser and visit:
```
http://localhost:8000
```
