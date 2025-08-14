# S3 Image Integration

## Overview

The S3 image integration system provides secure, optimized access to private images stored in AWS S3. It uses presigned URLs to maintain security while enabling efficient image loading and caching.

## Implementation Details

### Core Components

#### S3 URL API Route
Located at `src/app/api/s3-url/route.ts`, this generates secure presigned URLs for S3 objects.

**Key Features:**
- Secure presigned URL generation with 1-hour expiration
- Automatic bucket name extraction from S3_BUCKET_URL
- Error handling and fallback responses
- AWS SDK v3 integration

#### Image Loading Hook
Located at `src/lib/hooks/useImageLoader.ts`, this manages image loading states and S3 URL processing.

**Functionality:**
- Automatic S3 URL generation for private images
- Loading states and error handling
- Fallback image support
- Caching of processed URLs

#### Utility Functions
Located at `src/lib/utils.ts`, this provides the core S3 image URL generation logic.

### Architecture

```
Client Request → S3 URL API → AWS S3 → Presigned URL → Client
     ↓              ↓           ↓           ↓           ↓
  Image Path   Bucket Name  Object Key  Secure URL  Image Load
```

## Configuration

### Environment Variables

Required environment variables for S3 functionality:

```bash
# S3 Configuration
S3_BUCKET_URL=https://your-bucket-name.s3.amazonaws.com
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-west-2

# Optional: Custom bucket name (if different from S3_BUCKET_URL)
S3_BUCKET_NAME=your-custom-bucket-name
```

### AWS IAM Permissions

The AWS credentials must have the following S3 permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### Next.js Image Configuration

Configure Next.js to allow S3 images in `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slickage-website.s3.us-west-2.amazonaws.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
};

export default nextConfig;
```

## Usage Guidelines

### Basic Image Loading

```tsx
import { useImageLoader } from '@/lib/hooks/useImageLoader';

export default function MyComponent() {
  const { imageUrl, isLoading, hasError } = useImageLoader('/images/hero.jpg');
  
  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error loading image</div>;
  
  return <img src={imageUrl} alt="Hero image" />;
}
```

### With LazyImage Component

```tsx
import { LazyImage } from '@/components/ui';

export default function ImageComponent() {
  return (
    <LazyImage
      src="/images/case-study/example.jpg"
      alt="Case study example"
      width={400}
      height={300}
      className="rounded-lg"
      showLoadingSpinner={true}
      fallbackImage="/placeholder.svg"
    />
  );
}
```

### With LazyImageLightbox Component

```tsx
import { LazyImageLightbox } from '@/components/ui';

export default function GalleryImage() {
  return (
    <LazyImageLightbox
      src="/images/gallery/photo.jpg"
      alt="Gallery photo"
      width={300}
      height={200}
      className="cursor-pointer hover:opacity-90 transition-opacity"
      showLoadingSpinner={true}
    />
  );
}
```

### Direct S3 URL Generation

```tsx
import { getS3ImageUrl } from '@/lib/utils';

export default async function ServerComponent() {
  const imageUrl = await getS3ImageUrl('/images/hero.jpg', '/fallback.jpg');
  
  return <img src={imageUrl} alt="Hero image" />;
}
```

## API Reference

### S3 URL API Endpoint

**Endpoint:** `GET /api/s3-url?key={image_path}`

**Parameters:**
- `key` (required): The path to the image within the S3 bucket

**Response:**
```json
{
  "url": "https://your-bucket.s3.amazonaws.com/images/hero.jpg?X-Amz-Algorithm=...&X-Amz-Expires=3600&..."
}
```

**Error Response:**
```json
{
  "error": "Failed to generate URL"
}
```

### useImageLoader Hook

```typescript
interface UseImageLoaderOptions {
  defaultImage?: string;    // Default image to show initially
  fallbackImage?: string;   // Image to show on error
}

interface UseImageLoaderReturn {
  imageUrl: string;         // Current image URL (processed or fallback)
  isLoading: boolean;       // Loading state
  hasError: boolean;        // Error state
}
```

### getS3ImageUrl Function

```typescript
async function getS3ImageUrl(
  path: string,
  fallbackUrl?: string
): Promise<string>
```

**Parameters:**
- `path`: The image path within the S3 bucket
- `fallbackUrl`: Optional fallback URL (defaults to '/placeholder.svg')

**Returns:** Promise that resolves to the presigned URL or fallback URL

## Security Features

### 1. Presigned URLs
- URLs expire after 1 hour for security
- No permanent access to private S3 objects
- Automatic URL regeneration for each request

### 2. Access Control
- Server-side only S3 credentials
- Client never sees AWS credentials
- IAM policies control access to specific buckets

### 3. Input Validation
- Path sanitization and validation
- Bucket name extraction from configured URL
- Error handling prevents information leakage

## Performance Optimization

### 1. Caching Strategy
- Presigned URLs cached for 1 hour
- Automatic fallback to placeholder images
- Loading states prevent layout shifts

### 2. Image Optimization
- Next.js automatic image optimization
- WebP/AVIF format conversion
- Responsive image generation
- Lazy loading for below-the-fold images

### 3. Error Handling
- Graceful fallback to placeholder images
- User-friendly error states
- Logging for debugging and monitoring

## Best Practices

### 1. Image Organization
```
S3 Bucket Structure:
/images/
  /case-studies/
    case-study-1.jpg
    case-study-2.jpg
  /insights/
    insight-1.jpg
    insight-2.jpg
  /team/
    team-member-1.jpg
    team-member-2.jpg
```

### 2. Naming Conventions
- Use descriptive, lowercase names
- Separate words with hyphens
- Include dimensions or purpose in filename
- Avoid special characters

### 3. Performance Considerations
- Optimize images before upload (compress, resize)
- Use appropriate formats (JPEG for photos, PNG for graphics)
- Consider implementing image CDN for global distribution
- Monitor S3 costs and usage

### 4. Security Considerations
- Regularly rotate AWS access keys
- Use least-privilege IAM policies
- Monitor S3 access logs
- Implement CloudTrail for audit trails

## Examples

### Case Study Image Loading

```tsx
import { LazyImage } from '@/components/ui';

export default function CaseStudyImage({ imagePath, alt, caption }: {
  imagePath: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-8">
      <LazyImage
        src={imagePath}
        alt={alt}
        width={800}
        height={600}
        className="w-full h-auto rounded-lg shadow-lg"
        showLoadingSpinner={true}
        fallbackImage="/placeholder.svg"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

### Team Member Avatar

```tsx
import { LazyImage } from '@/components/ui';

export default function TeamMember({ name, role, imagePath }: {
  name: string;
  role: string;
  imagePath: string;
}) {
  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
        <LazyImage
          src={imagePath}
          alt={`${name} - ${role}`}
          fill
          className="object-cover"
          showLoadingSpinner={false}
          fallbackImage="/placeholder-user.jpg"
        />
      </div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
}
```

### Gallery with Lightbox

```tsx
import { LazyImageLightbox } from '@/components/ui';

export default function ImageGallery({ images }: { images: Array<{ src: string; alt: string }> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <div key={index} className="aspect-square overflow-hidden rounded-lg">
          <LazyImageLightbox
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
            showLoadingSpinner={true}
            fallbackImage="/placeholder.svg"
          />
        </div>
      ))}
    </div>
  );
}
```

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check S3_BUCKET_URL environment variable
   - Verify AWS credentials have S3 read permissions
   - Check if image path exists in S3 bucket
   - Verify Next.js image configuration

2. **Presigned URL errors**
   - Check AWS region configuration
   - Verify S3 bucket exists and is accessible
   - Check IAM permissions for GetObject action

3. **Performance issues**
   - Monitor S3 request latency
   - Consider implementing CloudFront CDN
   - Optimize image sizes before upload
   - Use appropriate image formats

4. **Security concerns**
   - Regularly rotate AWS access keys
   - Monitor S3 access logs
   - Review IAM policies for least privilege
   - Implement CloudTrail for audit trails

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and checking browser console for detailed error messages.

### Monitoring

Monitor the following metrics:
- S3 API request counts and latency
- Presigned URL generation success rate
- Image loading performance
- Error rates and types
- S3 storage costs and usage

## Integration with Other Systems

### Database Integration
Images are referenced by path in the database, and the S3 integration automatically handles URL generation:

```typescript
// Database schema
interface CaseStudy {
  id: string;
  title: string;
  heroImage: string; // S3 path like '/images/case-studies/hero.jpg'
  // ... other fields
}

// Component usage
const { imageUrl } = useImageLoader(caseStudy.heroImage);
```

### Content Management
The system supports easy image updates by simply changing the S3 path in the database, without requiring code changes.

### Deployment Considerations
- Ensure S3 bucket is in the same region as your application for optimal performance
- Consider using CloudFront for global image distribution
- Implement proper backup and disaster recovery for S3 assets
- Monitor S3 costs and implement lifecycle policies for cost optimization
