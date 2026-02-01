# EduTask README

# EduTask – Assignment Management System

EduTask is a role-based assignment management platform built with **Next.js App Router**, **NextAuth**, and **MongoDB**. It supports Admin and Student roles with complete authentication and assignment workflows.

## ✨ Features

### 🔐 Authentication

- User registration
- Login with credentials
- Google OAuth login
- Email verification using OTP
- Forgot password flow
- Reset password via OTP
- Role-based access (Admin / Student)

### 👨‍💼 Admin Features

- Admin dashboard
- Create assignments
- Read assignments
- Update assignments
- Delete assignments
- View student enrollments

### 👨‍🎓 Student Features

- View available assignments
- Enroll in assignments
- View enrolled assignments
- Submit assignments
- Track submission status:
    - `NOT_SUBMITTED`
    - `SUBMITTED`

### 📋 Assignment Workflow

1. Admin creates assignment
2. Student views available assignments
3. Student enrolls
4. Student submits assignment

## 🛠️ Tech Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | Next.js 14 (App Router), React |
| **Backend** | Next.js API Routes |
| **Authentication** | NextAuth.js |
| **Database** | MongoDB + Mongoose |
| **Validation** | Zod |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Notifications** | Sonner |
| **Date Handling** | date-fns |

## 👥 User Roles

| Role | Access |
| --- | --- |
| **Admin** | Assignment CRUD, Enrollment Management |
| **Student** | Enroll, Submit, View Status |

## 🔑 Demo Credentials

### Guest Admin

- **Email:** [`admin@gmail.com`](mailto:admin@gmail.com)
- **Password:** [`admin@gmail.com`](mailto:admin@gmail.com)

### Guest Student

- **Email:** [`student@gmail.com`](mailto:student@gmail.com)
- **Password:** [`student@gmail.com`](mailto:student@gmail.com)

## 🔄 Auth Flow

### Signup

Register → Email OTP → Verify → Login

### Forgot Password

Enter email → OTP → Reset password → Login

## 📁 Project Structure

```
app/
 ├─ api/
 │   ├─ auth/
 │   ├─ admin/
 │   │   ├─ assignments/
 │   │   └─ enrollments/
 │   └─ student/
 │       └─ assignments/
 │
 ├─ admin/
 ├─ student/
 ├─ auth/
 │   ├─ login
 │   ├─ signup
 │   ├─ forgot-password
 │   └─ verify-email
 │
lib/
models/
middleware/
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```
MONGODB_URI=your_mongodb_url

NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 🚀 Getting Started

### Installation

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## 🌐 Live Deployment

👉 [edutask-mrpankajpandey.vercel.app]

## 📦 GitHub Repository

👉 [https://github.com/mrpankajpandey/Edtask-.git]

## 👤 Author

**Pankaj Kumar Pandey**

- GitHub: [mrpankajpandey](https://github.com/mrpankajpandey)
- LinkedIn: [mrpankajpandey](https://linkedin.com/in/mrpankajpandey)

## 🚀 Future Improvements

- [ ]  File upload for assignment submission
- [ ]  Admin analytics dashboard
- [ ]  Pagination & filtering
- [ ]  Role-based permissions middleware
- [ ]  Assignment deadlines auto-lock

---

**Made with ❤️ by Pankaj Kumar Pandey**