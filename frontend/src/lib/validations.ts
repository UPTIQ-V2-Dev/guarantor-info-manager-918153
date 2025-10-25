import { z } from 'zod';

// Address validation schema
export const addressSchema = z.object({
    street: z.string().min(1, 'Street address is required').max(200, 'Street address is too long'),
    city: z.string().min(1, 'City is required').max(100, 'City name is too long'),
    state: z.string().min(2, 'State is required').max(2, 'State must be 2 characters'),
    zip: z.string().min(5, 'ZIP code must be at least 5 characters').max(10, 'ZIP code is too long')
});

// Guarantor form validation schema
export const guarantorFormSchema = z.object({
    guarantor_name: z.string().min(1, 'Full name is required').max(200, 'Name is too long'),
    relationship_to_borrower: z
        .string()
        .min(1, 'Relationship to borrower is required')
        .max(500, 'Description is too long'),
    address: addressSchema,
    date_of_birth: z.string().min(1, 'Date of birth is required'),
    occupation: z.string().min(1, 'Occupation is required').max(200, 'Occupation is too long'),
    employer_or_business: z.string().min(1, 'Employer or business name is required').max(200, 'Name is too long'),
    linkedin_profile: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    company_registration_number: z.string().max(100, 'Registration number is too long').optional(),
    known_associations: z.array(z.string()),
    comments: z.string().max(2000, 'Comments are too long')
});

export type GuarantorFormData = z.infer<typeof guarantorFormSchema>;
