# Trainer Platform Setup Instructions

Because the automated setup commands encountered environment issues, please run the following commands manually in your terminal at `d:\manas-learnings\frontend\trainer-app`:

## 1. Install Dependencies
```bash
npm install
npm install prisma @prisma/client @types/bcryptjs @types/jsonwebtoken bcryptjs jsonwebtoken lucide-react clsx tailwind-merge zod react-hook-form @hookform/resolvers @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-radio-group zustand jose
```

## 2. Helper Installation
If the above single line fails, install these groups:
```bash
npm install next react react-dom
npm install -D typescript @types/node @types/react @types/react-dom autoprefixer postcss tailwindcss eslint eslint-config-next
npm install prisma --save-dev
npm install @prisma/client
npm install lucide-react clsx tailwind-merge
npm install zustand jose bcryptjs
npm install -D @types/bcryptjs
```

## 3. Database Setup
Ensure you have PostgreSQL running. Update `.env` with your credentials if needed.
Then run:
```bash
npx prisma generate
npx prisma db push
```

## 4. Run the Application
```bash
npm run dev
```

## 5. Usage
- Register a new user at `/register`.
- By default all users are students. Can manually change role in DB or add a seed script.
- Login as Admin (Check DB or manually set role to `SUPER_ADMIN`).
- Create tests, add questions.
- Login as Student to take tests.
