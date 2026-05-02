# Silis Brothers

A custom website built with Astro to showcase my kids' stop-motion animations to family and friends.

## 🚀 Features

- **Astro 6.x:** Fast, content-focused web framework.
- **Tailwind CSS & DaisyUI:** Modern, responsive styling.
- **Cloudflare R2:** Integrated with Cloudflare R2 for efficient video hosting and delivery.
- **Responsive Design:** Optimized for viewing on desktops, tablets, and phones.

## 🛠️ Project Structure

```text
/
├── public/          # Static assets (favicons, logos)
├── src/
│   ├── assets/      # Styles and fonts
│   ├── components/  # Reusable Astro components (Navbar, etc.)
│   ├── layouts/     # Page layouts
│   └── pages/       # Website routes (Home, About, Videos)
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `yarn install`  | Installs dependencies                       |
| `yarn dev`      | Starts local dev server at `localhost:4321` |
| `yarn build`    | Build your production site to `./dist/`     |
| `yarn preview`  | Preview your build locally                  |
| `yarn astro`    | Run Astro CLI commands                      |

## 📦 Infrastructure

- **Hosting:** Cloudflare Pages (recommended for Astro)
- **Storage:** Cloudflare R2 (for video content)
