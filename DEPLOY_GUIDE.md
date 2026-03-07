# DC Portfolio Deployment Guide

Welcome! This guide will walk you through deploying your portfolio website. Don't worry—if you understand HTML, JSON, and scripts, you've got all the foundational knowledge you need. We'll take it step by step.

**Estimated time:** 30-45 minutes on your first run.

---

## Part 1: Create Free Accounts

Before you start, sign up for three free services. All have generous free tiers and no credit card required to start.

### 1.1 Create a GitHub Account

GitHub is where your code will live.

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Enter your email and create a password
4. Choose a username (this will appear in your project URL)
5. Verify your email
6. Click "Create account"

**You're done!** You now have a GitHub account.

### 1.2 Create a Sanity Account

Sanity is your content management system (CMS)—think of it as your admin panel where you'll add projects, write blog posts, and upload images.

1. Go to [sanity.io](https://sanity.io)
2. Click "Get Started" or "Sign Up"
3. Create an account (you can use your GitHub account to sign in quickly)
4. Verify your email
5. You're ready to create projects inside Sanity later

**Note:** Sanity's free tier includes 10,000 API requests per day and 500,000 assets—more than enough for a portfolio site.

### 1.3 Create a Vercel Account

Vercel is where your website will be hosted and automatically deployed.

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Click "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
5. Complete the setup flow
6. You're done!

**Why GitHub login?** This makes deployment automatic—when you push code to GitHub, Vercel rebuilds your site instantly.

---

## Part 2: Install Required Tools on Your Mac

Your computer needs two essential tools: Node.js and Git. Both are free.

### 2.1 Install Node.js

Node.js lets you run JavaScript on your computer and manage project dependencies.

1. Go to [nodejs.org](https://nodejs.org)
2. Click the **LTS** (Long Term Support) version button—this is the stable version
3. Run the downloaded installer
4. Follow the prompts to complete installation
5. Restart your Terminal (or open a new one)

### 2.2 Verify Node.js Installation

Let's confirm Node.js installed correctly.

1. Open **Terminal** (find it in Applications → Utilities → Terminal, or press Cmd+Space and type "Terminal")
2. Copy and paste this command, then press Enter:

```bash
node -v
```

You should see a version number like `v20.11.0`. If you do, ✓ Node.js is installed!

3. Now check npm (Node's package manager) with:

```bash
npm -v
```

You should see a version like `10.2.0`. Great!

### 2.3 Install Git

Git is how you'll version control your code and push it to GitHub.

1. Open Terminal
2. Paste this command and press Enter:

```bash
xcode-select --install
```

3. A dialog will appear. Click "Install"
4. Wait for installation to complete (this may take a few minutes)
5. Verify Git installed by typing:

```bash
git --version
```

You should see something like `git version 2.37.0`. Done!

---

## Part 3: Set Up Your Project Locally

Now we'll get the project running on your Mac.

### 3.1 Navigate to Your Documents Folder

1. Open Terminal
2. Type this command to go to your Documents folder:

```bash
cd ~/Documents
```

### 3.2 Copy the Project Folder

The `dc-portfolio` folder contains your entire project.

1. Make sure the `dc-portfolio` folder is in your Documents folder
2. In Terminal, navigate into it:

```bash
cd dc-portfolio
```

3. Verify you're in the right place by typing:

```bash
ls
```

You should see files and folders like `package.json`, `src/`, `public/`, etc.

### 3.3 Install Dependencies

Your project depends on libraries (code written by others). npm downloads and installs all of them.

1. While inside the `dc-portfolio` folder, run:

```bash
npm install
```

This will take 1-3 minutes. You'll see lots of output—that's normal. Wait for it to finish.

2. When complete, you should see:
   ```
   added XXX packages
   ```

### 3.4 Set Up Environment Variables

Environment variables store sensitive information like your Sanity Project ID.

1. In the `dc-portfolio` folder, find the file called `.env.local.example`
2. Duplicate it and rename the copy to `.env.local` (remove the `.example` part)
3. Open `.env.local` in a text editor (like VS Code or TextEdit)

### 3.5 Create a Sanity Project and Get Your Project ID

Now you'll create your project space in Sanity.

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Log in if prompted
3. Click "Create new project" or "New"
4. Give it a name: `DC Portfolio`
5. Select your plan: **Free** (already selected)
6. Click "Create"
7. Wait for your project to initialize
8. Once created, you'll see your **Project ID** displayed on the project page
9. Copy this ID (it looks like `a1b2c3d4`)

### 3.6 Add Your Project ID to .env.local

1. Open `.env.local` in your text editor
2. Find the line that says `NEXT_PUBLIC_SANITY_PROJECT_ID=`
3. Paste your Project ID after the `=` sign, like this:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=a1b2c3d4
```

4. Save the file

### 3.7 Connect Sanity to Your Project

This step syncs your local project with your Sanity account.

1. In Terminal (inside the `dc-portfolio` folder), run:

```bash
npx sanity init
```

2. Follow the prompts:
   - Select your Sanity project when asked
   - Confirm the dataset (usually `production`)
   - Agree to any configuration updates

3. The command will create a `sanity` folder and set everything up

### 3.8 Run Your Project Locally

Let's start the development server and see your site!

1. In Terminal, run:

```bash
npm run dev
```

2. You'll see output like:
   ```
   ▲ Next.js 14.0.0
   - Local: http://localhost:3000
   ```

3. Open your browser and go to `http://localhost:3000`
4. You should see your portfolio website!

**Keep this Terminal window open.** It's your development server. To stop it later, press `Ctrl+C`.

---

## Part 4: Access and Use Sanity Studio (Your Admin Panel)

Sanity Studio is your dashboard for managing content.

### 4.1 Open Sanity Studio Locally

While your development server is running:

1. In your browser, go to `http://localhost:3000/studio`
2. You'll be prompted to log in with your Sanity account
3. Click "Sign in"
4. After login, you'll see your Sanity Studio interface

### 4.2 Understand the Studio Layout

In Sanity Studio, you'll see:

- **Left Sidebar:** Your content types (Projects, Blog Posts, Navigation, Settings, etc.)
- **Main Area:** Where you create and edit content
- **Preview:** A real-time preview of your changes on the right

### 4.3 Create Your First Project Entry

1. In the left sidebar, click **"Projects"**
2. Click **"Create" or "+ New Project"**
3. Fill in these fields:
   - **Title:** Name of your project (e.g., "E-commerce Platform")
   - **Slug:** URL-friendly version (e.g., `ecommerce-platform`) — this auto-populates
   - **Description:** A short description of what the project does
   - **Tags:** Skills used (React, Tailwind, etc.)
   - **Link:** The live URL (optional)
   - **Featured Image:** Upload a project screenshot or photo

4. Click **"Publish"** to save

Your project is now live and will appear on your portfolio website!

### 4.4 Upload Images

When adding images to projects or blog posts:

1. Click the image field
2. Click **"Upload image"**
3. Select an image from your computer
4. The image uploads to Sanity's servers automatically
5. Sanity optimizes it automatically (no need to resize!)

### 4.5 Edit Navigation

Your site's menu is in Sanity.

1. In the left sidebar, click **"Navigation"**
2. You'll see your menu items
3. Edit text, add links, or reorder items
4. Click **"Publish"**
5. Refresh your site—changes appear instantly

### 4.6 Edit Site Settings

Site-wide settings (like your name, bio, social links) are under Settings.

1. In the left sidebar, click **"Settings"**
2. Edit fields like:
   - **Site Title:** Your name or company name
   - **Description:** A tagline or bio
   - **Social Media URLs:** Links to your GitHub, LinkedIn, Twitter, etc.
   - **Hero Image:** The main image on your homepage

3. Click **"Publish"**
4. Changes appear on your site immediately

---

## Part 5: Push Your Code to GitHub

Now we'll upload your project to GitHub so it's backed up and ready for deployment.

### 5.1 Initialize Git in Your Project

1. In Terminal (inside the `dc-portfolio` folder), run:

```bash
git init
```

### 5.2 Stage All Your Files

```bash
git add .
```

This tells Git "I want to track all these files."

### 5.3 Create Your First Commit

```bash
git commit -m "Initial commit"
```

This saves a snapshot of your project with the message "Initial commit."

### 5.4 Create a New Repository on GitHub

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon in the top-right corner
3. Click **"New repository"**
4. Name it: `dc-portfolio`
5. Choose **Private** (only you can see it) or **Public** (anyone can view it)
6. **Do NOT initialize with README, .gitignore, or license** (you already have these)
7. Click **"Create repository"**

### 5.5 Connect Your Local Folder to GitHub

GitHub will show you a URL like `https://github.com/YOUR_USERNAME/dc-portfolio.git`.

Copy that URL and run this command in Terminal (replace the URL):

```bash
git remote add origin https://github.com/YOUR_USERNAME/dc-portfolio.git
```

### 5.6 Push Your Code to GitHub

```bash
git branch -M main
git push -u origin main
```

This uploads your code to GitHub. You'll be prompted to log in—use your GitHub username and password (or a personal access token if you've set one up).

**Done!** Your code is now on GitHub.

---

## Part 6: Deploy to Vercel

Vercel will automatically rebuild and redeploy your site every time you push code to GitHub.

### 6.1 Import Your Project on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Click **"Import from GitHub"**
4. Find and select `dc-portfolio` from your GitHub repositories
5. Click **"Import"**

### 6.2 Add Environment Variables

Vercel needs your Sanity Project ID to work.

1. On the import screen, you'll see an "Environment Variables" section
2. Add a new variable:
   - **Name:** `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - **Value:** Paste your Sanity Project ID (from Part 3.5)

3. Click **"Add"**

### 6.3 Deploy

1. Click the **"Deploy"** button
2. Wait for the deployment to complete (usually 1-2 minutes)
3. You'll see a success message and a URL like:
   ```
   https://dc-portfolio-YOUR_USERNAME.vercel.app
   ```

4. Click that URL to visit your live site!

**Congratulations!** Your portfolio is now live on the internet.

### 6.4 Automatic Deployments

From now on:
- Every time you push code to GitHub (`git push`)
- Vercel automatically rebuilds and deploys your site
- Changes appear online within minutes

---

## Part 7: Custom Domain (Optional)

If you own a domain or want to buy one, you can point it to your Vercel site.

### 7.1 Buy a Domain (If You Don't Have One)

Popular registrars:
- [Namecheap](https://www.namecheap.com)
- [Google Domains](https://domains.google)
- [GoDaddy](https://www.godaddy.com)

Purchase a domain like `yourname.com`.

### 7.2 Connect Your Domain to Vercel

1. In Vercel, go to your project settings
2. Click **"Domains"**
3. Enter your domain name (e.g., `yourname.com`)
4. Click **"Add"**
5. Vercel will show you DNS records to add

### 7.3 Update DNS at Your Registrar

1. Log into your domain registrar (Namecheap, Google Domains, etc.)
2. Find the DNS settings for your domain
3. Add the DNS records Vercel provided
4. Save changes

**Note:** DNS changes take 24-48 hours to fully propagate. Your domain will work shortly!

---

## Part 8: Daily Use – Common Tasks

### 8.1 Add a New Project

1. Keep your development server running (`npm run dev`)
2. Open Sanity Studio at `http://localhost:3000/studio`
3. Click **"Projects"** in the left sidebar
4. Click **"Create"** or **"+ New Project"**
5. Fill in:
   - **Title:** Project name
   - **Description:** What it does
   - **Featured Image:** Upload a screenshot
   - **Tags:** Skills used
   - **Link:** Live URL (optional)
6. Click **"Publish"**
7. Your project appears on the website instantly

### 8.2 Write a Blog Post

1. In Sanity Studio, click **"Blog Posts"**
2. Click **"Create"** or **"+ New Post"**
3. Fill in:
   - **Title:** Post title
   - **Slug:** URL version (auto-populated)
   - **Published Date:** When you're writing it
   - **Content:** Write using the rich text editor
   - **Featured Image:** Cover image
4. Click **"Publish"**
5. The post appears on your blog page immediately

### 8.3 Change the Hero Image

The large image at the top of your homepage:

1. In Sanity Studio, click **"Settings"**
2. Find the **"Hero Image"** field
3. Click the current image to replace it
4. Upload a new image
5. Click **"Publish"**
6. Refresh your website—the new image appears!

### 8.4 Edit Navigation Menu Items

1. In Sanity Studio, click **"Navigation"**
2. You'll see menu items like "Home," "Projects," "Blog," "Contact"
3. Click any item to edit:
   - Change the **Label** (what visitors see)
   - Change the **URL** (where it links)
4. Click **"Publish"**
5. The menu updates instantly on your site

### 8.5 How Changes Get Published

When you publish content in Sanity:

1. Sanity sends a "webhook" (a notification) to Vercel
2. Vercel automatically rebuilds your site with the new content
3. Changes appear online within 1-2 minutes
4. **You don't need to do anything else—it's automatic!**

---

## Part 9: Troubleshooting

### Problem: `npm install` Failed

**Solution:**

1. Delete the `node_modules` folder and `package-lock.json` file:

```bash
rm -rf node_modules
rm package-lock.json
```

2. Try installing again:

```bash
npm install
```

3. If it still fails, you may have a network issue. Try again in a few minutes.

---

### Problem: Images Not Showing on Your Site

**Solution:**

1. Double-check your `.env.local` file has the correct Sanity Project ID:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID
```

2. Make sure you uploaded the image in Sanity Studio (not just added a file locally)
3. Restart your development server:
   - Press `Ctrl+C` in Terminal to stop it
   - Run `npm run dev` again
4. Refresh your browser

---

### Problem: Site Not Updating After You Push Code

**Solution:**

1. Go to [vercel.com](https://vercel.com)
2. Click your project (`dc-portfolio`)
3. Click **"Deployments"** at the top
4. Look at the most recent deployment
5. If it shows **"Building..."**, wait—it's still deploying
6. If it shows a **red X** or error, click it to see what went wrong
7. Common issues:
   - Missing environment variables (check Part 6.2)
   - Code syntax error (check your Terminal output for hints)
   - Missing dependency (run `npm install` locally and push again)

---

### Problem: Contact Form Not Sending Emails

The contact form requires an email service. By default, it won't work.

**To enable emails:**

1. Sign up for a free account at [resend.com](https://resend.com)
2. Get your **API Key** from Resend
3. Add it to Vercel:
   - Go to your project → Settings → Environment Variables
   - Add: `RESEND_API_KEY` = your API Key
4. Redeploy on Vercel
5. Contact form emails now work!

---

### Problem: Can't Connect to Sanity Studio

**Solution:**

1. Make sure your development server is running (`npm run dev`)
2. Go to `http://localhost:3000/studio` in your browser
3. If you see a login prompt, log in with your Sanity account
4. If you see an error, check that you ran `npx sanity init` (Part 3.7)

---

### Still Stuck?

If something isn't working:

1. **Check the Terminal output** for error messages—they're usually helpful
2. **Google the error message** (most developers have hit it before)
3. **Check Vercel deployment logs** for clues if your site won't deploy
4. **Reach out to the community:**
   - Sanity Support: [sanity.io/help](https://sanity.io/help)
   - Vercel Support: [vercel.com/help](https://vercel.com/help)
   - Stack Overflow: Search your error message

---

## You're Ready!

You've successfully deployed a modern, professional portfolio website. Here's what you accomplished:

✓ Created accounts on GitHub, Sanity, and Vercel
✓ Installed Node.js and Git
✓ Set up your project locally
✓ Connected to Sanity for content management
✓ Deployed to Vercel (live on the internet!)
✓ Learned how to update content and push code

From here, you can:
- Add more projects and blog posts
- Customize your site's appearance (edit styles in the `src/` folder)
- Connect a custom domain
- Share your portfolio with the world

**Happy deploying!**
