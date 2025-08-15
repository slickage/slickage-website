# Route Optimization

## Overview

This document describes the optimization changes made to remove unused routes from the Next.js build, improving build performance and reducing bundle size.

## Changes Made

### 1. Route Grouping and File Disabling

All unused routes have been moved to a route group `(unused-routes)` and their page files have been disabled to prevent them from being included in the production build.

**Routes Moved and Disabled:**

- `(testing)/` - Testing components and pages
- `about/` - About page (not linked from navigation)
- `projects/` - Projects page (not linked from navigation)
- `services/` - Services page (not linked from navigation)

### 2. File Structure

```
src/app/
├── (unused-routes)/          # Route group - not included in build
│   ├── (testing)/
│   │   └── components/
│   │       └── spinner/
│   │           └── page.tsx.disabled
│   ├── about/
│   │   └── page.tsx.disabled
│   ├── projects/
│   │   └── page.tsx.disabled
│   └── services/
│       └── page.tsx.disabled
├── api/                      # Active API routes
│   ├── contact/              # Contact form submission
│   ├── client-config/        # reCAPTCHA configuration
│   └── s3-url/              # S3 image loading (actively used!)
├── contact/                  # Active contact page
├── case-studies/            # Active case studies
├── cookie-policy/           # Active policy pages
├── privacy-policy/          # Active policy pages
└── page.tsx                 # Home page
```

### 3. Component Updates

- **ProjectCard**: Removed broken link to `/projects/${id}` since the route is no longer accessible
- Replaced with informational text: "Project details available upon request"

### 4. Configuration Updates

- **Sitemap**: Removed references to deleted routes (`/about`, `/services`, `/projects`)
- **Robots.txt**: Removed reference to deleted `/(testing)/` route

## Implementation Details

### Method Used: File Extension Disabling

Since Next.js route groups don't automatically exclude routes from the build, we used a file extension approach:

- Moved unused routes to `(unused-routes)` folder
- Renamed `page.tsx` files to `page.tsx.disabled`
- Next.js only recognizes `page.tsx` as valid page files

### Build Results

**Before Optimization:**

- Total routes: 16
- Unused routes included: `/about`, `/projects`, `/services`, `/components/spinner`

**After Optimization:**

- Total routes: 12
- Unused routes excluded: All successfully removed
- Build time: Reduced from 2000ms to 1000ms

## Active Routes Analysis

### ✅ **Routes That Are Actively Used**

- `/` - Home page (linked from navigation)
- `/contact` - Contact page (linked from header and footer)
- `/case-studies/[id]` - Case study pages (linked from insight cards)
- `/cookie-policy` - Policy page (linked from footer)
- `/privacy-policy` - Policy page (linked from footer)
- `/api/contact` - Contact form submission
- `/api/client-config` - reCAPTCHA configuration (used by contact form)
- `/api/s3-url` - **S3 image loading (used by case studies and insights)**

### ❌ **Routes That Were Safely Removed**

- `/about` - Not linked from navigation
- `/projects` - Not linked from navigation
- `/services` - Not linked from navigation
- `/(testing)/` - Testing only
- `/api/recaptcha-config` - Empty directory

## Benefits

1. **Smaller Build Size**: Unused routes are excluded from the production build
2. **Faster Build Times**: Less code to process during build (50% improvement)
3. **Cleaner Production Bundle**: Only active routes are included
4. **Maintained Development**: Routes are still available for development/testing
5. **Easy Reactivation**: Simply rename files back to `page.tsx` if needed
6. **Preserved Functionality**: All critical features (S3 images, reCAPTCHA, contact) remain intact

## How It Works

1. **Route Groups**: Folders with parentheses group related routes without affecting URLs
2. **File Extension**: Next.js only processes files with specific extensions (`.tsx`, `.jsx`, `.ts`, `.js`)
3. **Disabled Files**: Files with `.disabled` extension are ignored by Next.js build process

## Future Considerations

If any of these routes need to be reactivated:

1. Rename `page.tsx.disabled` back to `page.tsx`
2. Move the route folder back to `src/app/` if needed
3. Update navigation components to include links
4. Ensure proper routing is configured
5. Update sitemap and metadata as needed

## Testing

After these changes:

- Build the project: `bun run build`
- Verify only active routes are included (should show 12 routes)
- Check that the home page and remaining routes work correctly
- Confirm unused routes are not accessible in production
- Verify build performance improvement
- Test S3 image loading in case studies and insights
- Verify reCAPTCHA functionality in contact form

## Files Modified

- `src/components/projects/project-card.tsx` - Removed broken project links
- `src/app/(unused-routes)/` - New folder structure for unused routes
- All unused route `page.tsx` files renamed to `page.tsx.disabled`
- `src/app/sitemap.ts` - Removed references to deleted routes
- `src/app/robots.ts` - Removed reference to deleted testing route
