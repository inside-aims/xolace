<a href="https://www.xolace.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://www.xolace.app/opengraph-image.jpg">
</a>

# 🌌 XOLACE

**Welcome to the official repo of Xolace — a safe space to express your thoughts, explore your emotions, and connect authentically.**

---

## ✨ What is Xolace?

Xolace is a modern, mental-health-conscious social platform where users can post freely (anonymously or not), interact in real time, and stay in control of their privacy. It blends **Twitter-like expressiveness** with **Reddit-level anonymity**, backed by **powerful moderation tools** and **AI-assisted content creation**.

---

## 👥 Who is it for?

- Users seeking a space to express emotions and thoughts safely.
- Moderators ("Blue Team") ensuring a healthy community.
- Help Professionals providing mental wellness support.
- Anonymous users who want to interact lightly without a full profile.

---

## ⚙️ Tech Stack

| Layer           | Stack                       |
|----------------|-----------------------------|
| Frontend       | Next.js, Tailwind CSS       |
| Backend        | Supabase (PostgreSQL, Auth) |
| Auth           | Supabase Auth (Email + Anonymous) |
| Real-time      | Supabase Realtime, Listeners |
| AI Assistant   | Shikigami (Next.js App with Token Auth) |
| DevOps         | Vercel, GitHub Actions (CI/CD) |

---

## 🧠 Core Features

- 📝 Post creation with mood tagging, 24hr expiration, and anonymous option.
- 💬 Real-time likes, comments, and anonymous replies.
- 🛡️ Robust user roles: Verified, Moderator (Blue Team), Help Professional.
- 🔍 Tag system and post tagging with frequency tracking.
- 📄 Activity logging with trigger-based auto-logging.
- 📋 Reporting system to maintain safe content.
- 🔐 Full privacy settings and user preferences.
- 🧙‍♂️ AI-powered post generation (Shikigami).
- 🔄 Soft-follow / protected post toggle (future-ready).
- 🌍 Multi-language support (coming soon).

---

## 🧩 Project Structure

# Project Structure: xolace

xolace/
├── components/  # Reusable UI components
├── pages/       # App routes
├── lib/         # API calls, helpers, utils
├── hooks/       # Custom React hooks
├── supabase/    # Supabase client + types
├── styles/      # Tailwind & global styles
├── layouts/     # Layout components
├── contexts/    # React context providers
└── public/      # Static assets

---

## 🔐 Roles Breakdown

| Role             | Access/Capabilities                           |
|------------------|-----------------------------------------------|
| Normal User      | Post, like, comment, report, customize prefs  |
| Verified User    | All above + verified badge                    |
| Blue Team        | Moderate content, verify users                |
| Help Professional| Support users anonymously or directly         |

---

## 🛠️ Local Development

```bash
# 1. Clone the repo
git clone https://github.com/inside-aims/xolace.git && cd xolace

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.local.example .env.local
# Fill in Supabase keys, URL, anon/public key

# 4. Run dev server
pnpm dev

```
