# With Risk - Astro Blog

A modern blog platform built with **Astro**, **Sanity CMS**, and a **.NET API** backend.

## 🏗️ Architecture

```
with-risk-astro/
├── blog/                 # Astro Frontend (SSG for SEO)
│   ├── src/
│   │   ├── components/   # Astro + React components
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # Static routes
│   │   └── lib/          # Sanity client, API agent
│   └── public/           # Static assets
│
├── api/                  # .NET API Backend (Clean Architecture)
│   ├── API/              # Controllers, Extensions
│   ├── Application/      # CQRS Handlers, DTOs
│   ├── Domain/           # Entities
│   └── Persistence/      # EF Core, Migrations
│
└── ../studio-blog/       # Sanity Studio (existing)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- .NET 8 SDK (or .NET 10 if available)
- Your existing Sanity Studio project

### 1. Configure Environment Variables

Create a `.env` file in the `blog/` folder:

```env
# Sanity Configuration
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production

# API Configuration
PUBLIC_API_URL=http://localhost:5000/api
```

You can find your Sanity project ID in [Sanity Manage](https://www.sanity.io/manage).

### 2. Start the API

```bash
cd api
dotnet run --project API
```

The API will start at `http://localhost:5000` with Swagger at `/swagger`.

### 3. Start the Blog

```bash
cd blog
npm run dev
```

The blog will start at `http://localhost:4321`.

### 4. Start Sanity Studio (from existing project)

```bash
cd ../studio-blog
npm run dev
```

## 📝 How It Works

### Content Flow

1. **Authors** create/edit posts in **Sanity Studio** (user-friendly CMS)
2. **Astro** fetches content from Sanity at **build time** → Static HTML (great SEO!)
3. **React islands** hydrate for interactive features (comments, likes)
4. **.NET API** handles user interactions → **SQLite** database (simple!)

### Static Site Generation (SSG)

Posts are generated at build time with full HTML:

```astro
---
// This runs at BUILD TIME - not on every request
export async function getStaticPaths() {
  const slugs = await sanityClient.fetch(queries.allPostSlugs);
  return slugs.map(slug => ({ params: { slug } }));
}
---
```

### React Islands

Interactive components hydrate on the client:

```astro
<!-- Only hydrates when visible in viewport -->
<CommentSection client:visible postSlug={slug} />
<LikeButton client:visible postSlug={slug} />
```

## 🛠️ Development

### Building for Production

```bash
# Build the blog
cd blog
npm run build

# Build the API
cd api
dotnet publish -c Release
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/comments/{postSlug}` | GET | Get comments for a post |
| `/api/comments` | POST | Create a comment |
| `/api/posts/{postSlug}/stats` | GET | Get post stats (likes, views) |
| `/api/posts/{postSlug}/like` | POST | Toggle like |
| `/api/posts/{postSlug}/view` | POST | Record view |

## 🚢 Deployment

### Blog (Static)

Deploy the `blog/dist` folder to any static host:
- **Netlify**: Connect repo, build command `npm run build`, publish `dist`
- **Vercel**: Similar setup
- **Cloudflare Pages**: Same approach

### API (.NET)

- **Railway**: Easy Docker deployment
- **Render**: Free tier available
- **Azure App Service**: Native .NET support

### Sanity Studio

Already hosted by Sanity, or deploy with:
```bash
cd ../studio-blog
npx sanity deploy
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `blog/src/lib/sanity.ts` | Sanity client and GROQ queries |
| `blog/src/lib/api.ts` | API agent (like your example) |
| `blog/src/layouts/BaseLayout.astro` | Main layout with SEO meta tags |
| `blog/src/pages/posts/[slug].astro` | Dynamic post pages |
| `api/API/Program.cs` | API entry point |
| `api/Persistence/DataContext.cs` | EF Core database context |

## ✨ Features

- ✅ **Great SEO** - Static HTML at build time
- ✅ **Sanity CMS** - Non-technical users can manage content
- ✅ **Clean Architecture** - Familiar .NET patterns
- ✅ **SQLite** - No cloud database complexity
- ✅ **React Islands** - Interactive where needed
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind-like styling** - CSS variables, modern design

## 🔜 Next Steps

1. Set up your Sanity environment variables
2. Add authentication (JWT) to the API if needed
3. Customize the styling in `BaseLayout.astro`
4. Deploy!


