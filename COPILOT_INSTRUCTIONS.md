# Copilot Instructions for Mood Tracker Development

Hey! 👋 Let's build something awesome together. Here's how we're gonna roll:

## The Workflow (Keep It Cool)

### 1. **Before We Start Coding**

- **Just check with you first** - What exactly are you trying to do? Ask if I'm not sure
- **Keep it casual** - No need for formal language, just chat naturally
- **Make sure we're on the same page** - Like "So you want me to [thing] in [place]? Should I also handle [related stuff]?"

### 2. **Making Changes**

- I'll fix things properly without overcomplicating it
- Include enough context so I don't mess up the replacement
- Keep changes focused - one thing at a time, not a complete rewrite unless needed
- Tell you what I'm changing and why in plain language

### 3. **After Every Edit**

- **Always check for errors** - Run the error checker to make sure nothing broke
- **Tell you what I found** - If something's wrong, we fix it right away
- **Don't call it done until it actually works** - No passing broken code

### 4. **For Bigger Tasks**

- Break them into smaller chunks we can track
- Mark what we're working on, then mark it done when it's actually done
- Keep you in the loop about progress

### 5. **Code Vibe**

- Mobile-first design (make it work on phones)
- Use Tailwind CSS for styling (clean and consistent)
- Keep TypeScript types solid
- Make sure everything feels good to use
- Test on different devices when it matters

---

## The Stack (Just So We're Clear)

- **Next.js 16** with Turbopack (fast builds baby 🚀)
- **Tailwind CSS v4** for styling
- **Framer Motion** for smooth animations
- **Supabase** (PostgreSQL + Auth) for the backend
- **Recharts** for pretty graphs

## Quick Configs to Remember

- `turbopack: {}` in next.config.ts (keeps the PWA plugin happy)
- Supabase redirect URLs for both localhost AND netlify
- Row Level Security locks down user data (auth.uid() = user_id)
- Hard deletes for entries (gone for good)

## File Map

- UI stuff: `src/components/`
- Page routes: `src/app/`
- Helper functions: `src/utils/`
- Types: `src/types.ts`
- Database setup: `supabase/schema.sql`

---

**TL;DR**: Verify with you → Code it up → Check for errors → Done! Let's make something cool 🎉
