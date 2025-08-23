# Environment Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the Slickage website development environment. Follow these instructions to get your local development environment running quickly and efficiently.

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Bun** (v1.0 or higher) - [Installation guide](https://bun.sh/docs/installation)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Optional Software

- **Docker** - For containerized development
- **PostgreSQL** - For local database development
- **AWS CLI** - For S3 integration testing

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slickage-website
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Required Environment Variables
S3_BUCKET_NAME=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region

# Optional Environment Variables
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
DATABASE_URL=your-database-url
NODE_ENV=development
```

### 4. Start Development Server

```bash
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Detailed Setup Instructions

### Environment Variables Configuration

#### Required Variables

| Variable                | Description                                 |
| ----------------------- | ------------------------------------------- |
| `S3_BUCKET_NAME`         | S3 bucket name for private image assets |
| `AWS_ACCESS_KEY_ID`     | AWS access key for S3 operations            |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 operations            |
| `AWS_REGION`            | AWS region for S3 bucket                    |

#### Optional Variables

| Variable               | Description                           |
| ---------------------- | ------------------------------------- |
| `RECAPTCHA_SITE_KEY`   | Google reCAPTCHA site key             |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA secret key           |
| `DATABASE_URL`         | PostgreSQL database connection string |
| `NODE_ENV`             | Environment mode                      |

### AWS S3 Setup

If you need to set up S3 for image storage:

1. **Create an S3 Bucket**

   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Configure CORS** (if needed)

   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

3. **Create IAM User**
   - Go to AWS IAM Console
   - Create a new user with programmatic access
   - Attach the `AmazonS3ReadOnlyAccess` policy
   - Save the access key and secret key

### Database Setup (Optional)

If you're using the database features:

1. **Install PostgreSQL**

   ```bash
   # macOS
   brew install postgresql

   # Ubuntu
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Create Database**

   ```bash
   createdb slickage_dev
   ```

3. **Run Migrations**
   ```bash
   bun run db:migrate
   ```

## Development Workflow

### Available Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `bun dev`              | Start development server          |
| `bun build`            | Build for production              |
| `bun start`            | Start production server           |
| `bun lint`             | Run ESLint                        |
| `bun lint:fix`         | Run ESLint with auto-fix          |
| `bun format`           | Format code with Prettier         |
| `bun format:check`     | Check code formatting             |
| `bun run tsc --noEmit` | Type check without emitting files |

### Code Quality Tools

#### ESLint

```bash
# Check for linting issues
bun lint

# Auto-fix linting issues
bun lint:fix
```

#### Prettier

```bash
# Format code
bun format

# Check formatting without making changes
bun format:check
```

#### TypeScript

```bash
# Type check
bun run tsc --noEmit
```

### Git Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the [Code Style Guide](../guidelines/code-style.md)
   - Write tests for new features
   - Update documentation as needed

3. **Run quality checks**

   ```bash
   bun lint
   bun format:check
   bun run tsc --noEmit
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Docker Development

### Using Docker Compose

1. **Start the development environment**

   ```bash
   docker-compose up -d
   ```

2. **View logs**

   ```bash
   docker-compose logs -f
   ```

3. **Stop the environment**
   ```bash
   docker-compose down
   ```

### Building Docker Image

```bash
# Build the image
docker build -t slickage-website .

# Run the container
docker run -p 3000:3000 --env-file .env slickage-website
```

## Troubleshooting

### Common Issues

#### 1. Bun Installation Issues

```bash
# If bun is not found, install it
curl -fsSL https://bun.sh/install | bash

# Restart your terminal or run
source ~/.bashrc
```

#### 2. Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

#### 3. Environment Variables Not Loading

```bash
# Ensure .env file exists
ls -la .env

# Check environment variables
bun run env:check
```

#### 4. TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
bun install
```

#### 5. S3 Connection Issues

- Verify AWS credentials are correct
- Check S3 bucket permissions
- Ensure bucket region matches `AWS_REGION`

### Performance Issues

#### 1. Slow Development Server

```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
bun dev
```

#### 2. Large Bundle Size

- Use dynamic imports for heavy components
- Implement lazy loading for images
- Check for unused dependencies

### Debugging

#### 1. Enable Debug Logging

```bash
# Set debug environment variable
DEBUG=* bun dev
```

#### 2. Browser Developer Tools

- Open browser developer tools
- Check Console for errors
- Monitor Network tab for failed requests

#### 3. Next.js Debug Mode

```bash
# Start with debug information
NODE_OPTIONS='--inspect' bun dev
```

## Production Deployment

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:

```env
NODE_ENV=production
S3_BUCKET_NAME=your-production-s3-bucket
AWS_ACCESS_KEY_ID=your-production-aws-key
AWS_SECRET_ACCESS_KEY=your-production-aws-secret
AWS_REGION=us-west-2
```

### Build and Deploy

```bash
# Build the application
bun build

# Start production server
bun start
```

## Configuration & Environment Variables

- All environment-specific values (API keys, endpoints, secrets) should be placed in a `.env` file in the project root.
- Example usage in code: `process.env.MY_VARIABLE`
- **Never commit your `.env` files to version control.**

### Required Environment Variables

The following environment variables are required for full functionality:

- `S3_BUCKET_NAME` - S3 bucket name for private image assets (server-side only)
- `AWS_ACCESS_KEY_ID` - AWS access key for S3 operations
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3 operations
- `AWS_REGION` - AWS region for S3 bucket

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

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Error Handling

This project uses a reusable React Error Boundary component to catch and display errors in the UI gracefully. The error boundary wraps the main content in `src/app/layout.tsx` and provides a fallback UI with a reset button. You can use the `ErrorBoundary` component in other parts of the app as needed:

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

For more information on React error boundaries, see the [React docs](https://reactjs.org/docs/error-boundaries.html).

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Bun Documentation](https://bun.sh/docs)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [Code Style Guide](../guidelines/code-style.md)
3. Consult the [Component Architecture Guide](../guidelines/component-architecture.md)
4. Contact the development team

## Next Steps

After setting up your environment:

1. Review the [Code Style Guide](../guidelines/code-style.md)
2. Explore the [Component Architecture Guide](../guidelines/component-architecture.md)
3. Check out the [Lazy Loading Implementation](../features/lazy-loading.md)
4. Start contributing to the project!
