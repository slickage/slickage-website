# Slickage Website

A modern, scalable website for Slickage, a boutique software company based in Honolulu, Hawaii. Built with Next.js, TypeScript, and Tailwind CSS. Features include:

- Modular, reusable UI components
- Static and dynamic data support
- Optimized images and performance best practices
- Easy-to-update project and case study data

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Onboarding Checklist

- [ ] Clone the repository
- [ ] Install dependencies ( `bun install`)
- [ ] Creare `.env` and fill in required values
- [ ] Run the development server (`bun dev`)
- [ ] Open the app at [http://localhost:3000](http://localhost:3000)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Scripts

- `dev`: Start development server
- `build`: Build the app
- `start`: Start the production server
- `lint`: Run ESLint
- `lint:fix`: Run ESLint with auto-fix
- `format`: Run Prettier to format code

## Development Workflow

- Use Tailwind CSS utility classes for styling
- Run `bun lint` to check code quality
- Run `bun format` to auto-format code

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Configuration & Environment Variables

- All environment-specific values (API keys, endpoints, secrets) should be placed in a `.env` file in the project root.
- Example usage in code: `process.env.MY_VARIABLE`
- **Never commit your `.env` files to version control.**
- The following environment variables are required for local development and production:
  - `S3_BUCKET_URL` (used for remote images and assets)
- To add a new config value, add it to your `.env` and reference it in your code using `process.env.YOUR_VARIABLE`.

## Deployment & CI/CD

### Deploying with Docker

- Build the Docker image:
  ```bash
  docker build -t slickage-website .
  ```
- Run the container:
  ```bash
  docker run -p 3000:3000 --env-file .env slickage-website
  ```
- The app will be available at [http://localhost:3000](http://localhost:3000)

## Error Handling

This project uses a reusable React Error Boundary component to catch and display errors in the UI gracefully. The error boundary wraps the main content in `src/app/layout.tsx` and provides a fallback UI with a reset button. You can use the `ErrorBoundary` component in other parts of the app as needed:

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

For more information on React error boundaries, see the [React docs](https://reactjs.org/docs/error-boundaries.html).
