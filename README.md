# Slickage Website

A modern, scalable website for Slickage, a boutique software company based in Honolulu, Hawaii. Built with Next.js, TypeScript, and Tailwind CSS. Features include:

- Modular, reusable UI components
- Static and dynamic data support
- Optimized images and performance best practices
- Easy-to-update project and case study data
- Comprehensive lazy loading implementation
- Robust error handling and security features

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📚 Documentation

For comprehensive documentation, development guidelines, and feature implementations, see the [docs](./docs/) folder:

- **[Environment Setup](./docs/setup/environment.md)** - Get started with local development
- **[Code Style Guide](./docs/guidelines/code-style.md)** - Coding standards and best practices
- **[Component Architecture](./docs/guidelines/component-architecture.md)** - Component design patterns
- **[Lazy Loading Implementation](./docs/features/lazy-loading.md)** - Image lazy loading system
- **[Documentation Index](./docs/README.md)** - Complete documentation overview

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
- [ ] Create `.env` and fill in required values (see [Environment Setup](./docs/setup/environment.md))
- [ ] Run the development server (`bun dev`)
- [ ] Open the app at [http://localhost:3000](http://localhost:3000)
- [ ] Review the [Code Style Guide](./docs/guidelines/code-style.md)
- [ ] Explore the [Component Architecture](./docs/guidelines/component-architecture.md)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Scripts

- `dev`: Start development server
- `build`: Build the app
- `start`: Start the production server
- `lint`: Run ESLint
- `lint:fix`: Run ESLint with auto-fix
- `format`: Run Prettier to format code
- `format:check`: Check code formatting without making changes
- `inspect`: Start development server with Node.js inspector

## Development Workflow

- Use Tailwind CSS utility classes for styling
- Run `bun lint` to check code quality
- Run `bun format` to auto-format code
- Run `bun format:check` to verify code formatting
- Run `bun run tsc --noEmit` to check TypeScript types without emitting files
- Follow the [Code Style Guide](./docs/guidelines/code-style.md) for consistency

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

### Required Environment Variables

The following environment variables are required for full functionality:

- `S3_BUCKET_URL` - S3 bucket hostname for private image assets (server-side only)
- `AWS_ACCESS_KEY_ID` - AWS access key for S3 operations
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3 operations
- `AWS_REGION` - AWS region for S3 bucket

For detailed setup instructions, see the [Environment Setup Guide](./docs/setup/environment.md).

### Deployment-Specific Notes

**For Netlify Deployment:**

- Netlify reserves standard AWS environment variable names (`AWS_ACCESS_KEY_ID`, etc.)
- Use the `NETLIFY_*` prefixed versions in Netlify's environment variable settings
- The code automatically falls back to standard names for local development

**For Other Platforms:**

- Use standard AWS environment variable names (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`)

### Optional Environment Variables

- Additional configuration may be required depending on deployment environment
- Contact the development team for production environment setup

### Local Development Setup

1. Create a `.env` file in the project root
2. Add the required environment variables listed above
3. For S3 configuration, you'll need:
   - An AWS account with S3 access
   - IAM user with S3 read permissions
   - S3 bucket configured for your assets
4. **Never commit `.env` files to version control**

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

## Contributing

When contributing to this project:

1. Follow the [Code Style Guide](./docs/guidelines/code-style.md)
2. Review the [Component Architecture Guide](./docs/guidelines/component-architecture.md)
3. Update documentation for new features
4. Write tests for new functionality
5. Ensure all linting and type checks pass

For detailed contribution guidelines, see the [Documentation Index](./docs/README.md).
