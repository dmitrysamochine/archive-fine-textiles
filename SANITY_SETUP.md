# Archive Fine Textiles - Sanity Setup Guide

## Step 1: Create Sanity Project

1. Go to [sanity.io](https://sanity.io) and sign up/login
2. Click "Create new project"
3. Name it: **Archive Fine Textiles**
4. Choose dataset: **production**
5. Copy your **Project ID**

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Sanity credentials:

\`\`\`env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
\`\`\`

## Step 3: Install Dependencies

\`\`\`bash
npm install sanity next-sanity @sanity/vision @sanity/image-url
\`\`\`

## Step 4: Deploy Sanity Studio

You have two options:

### Option A: Embedded Studio (Recommended)
Create a route in your Next.js app to access Sanity Studio:

\`\`\`bash
# Studio will be available at /studio
\`\`\`

We'll set this up in the next phase.

### Option B: Separate Studio Deployment
\`\`\`bash
npx sanity init
# Follow prompts and use existing project ID
npx sanity deploy
\`\`\`

## Step 5: Generate API Token (for data import)

1. Go to [manage.sanity.io](https://manage.sanity.io)
2. Select your project
3. Go to **API** → **Tokens**
4. Click **Add API token**
5. Name: "Data Import"
6. Permissions: **Editor**
7. Copy the token and add to `.env.local`:

\`\`\`env
SANITY_API_TOKEN=your_token_here
\`\`\`

## Step 6: Import Your CSV Data

We'll create a data import script in the next phase to migrate your fabric inventory from CSV to Sanity.

## Schema Overview

Your Sanity schema includes:

- **fabricItem** - Main content type (250+ items from your CSV)
- **fabricCollection** - Groups related fabrics (e.g., "Zephyr", "18 Oz. Linen")
- **colorway** - Color variants (e.g., "Farro", "Caribe")
- **category** - Description categories (e.g., "Velvet", "Texture")
- **color** - Color taxonomy (e.g., "Blue", "Multi")

## Next Steps

1. Complete environment variable setup
2. Install dependencies
3. Deploy Sanity Studio
4. Run data import script (coming next)
5. Start building the frontend catalog interface
\`\`\`

```json file="" isHidden
