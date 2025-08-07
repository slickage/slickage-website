import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name too long' })
    .regex(/^[a-zA-Z\s\-.']+$/, { message: 'Name contains invalid characters' }),
  email: z
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email too long' })
    .transform((val) => val.toLowerCase()),
  phone: z
    .string()
    .max(255, { message: 'Phone too long' })
    .regex(/^[\d\s\-\+\(\)\.]*$/, { message: 'Phone contains invalid characters' })
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, { message: 'Subject is required' })
    .max(255, { message: 'Subject too long' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(5000, { message: 'Message too long' }),
  website: z.string().optional(), // Honeypot field
  elapsed: z.number().optional(), // Time elapsed (for spam detection)
  recaptchaToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;