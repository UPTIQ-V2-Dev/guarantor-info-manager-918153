import { PrismaClient, Role } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin',
            password: adminPassword,
            role: Role.ADMIN,
            isEmailVerified: true
        }
    });
    console.log('✅ Created admin user:', admin.email);
    // Create regular user for testing
    const userPassword = await bcrypt.hash('user123', 12);
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Test User',
            password: userPassword,
            role: Role.USER,
            isEmailVerified: true
        }
    });
    console.log('✅ Created test user:', user.email);
    // Create sample guarantor submissions
    const submission1 = await prisma.guarantorSubmission.upsert({
        where: { id: 'sample-guarantor-1' },
        update: {},
        create: {
            id: 'sample-guarantor-1',
            guarantorName: 'John Smith',
            relationshipToBorrower: 'Business Partner',
            streetAddress: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            dateOfBirth: new Date('1980-01-15'),
            occupation: 'Software Engineer',
            employerOrBusiness: 'Tech Corp Inc.',
            linkedinProfile: 'https://linkedin.com/in/johnsmith',
            companyRegistrationNumber: 'TC123456789',
            knownAssociations: ['Tech Association', 'Business Leaders Network'],
            comments: 'Reliable business partner with 10+ years experience.',
            recordStatus: 'pending_verification',
            submittedById: admin.id
        }
    });
    const submission2 = await prisma.guarantorSubmission.upsert({
        where: { id: 'sample-guarantor-2' },
        update: {},
        create: {
            id: 'sample-guarantor-2',
            guarantorName: 'Sarah Johnson',
            relationshipToBorrower: 'Financial Advisor',
            streetAddress: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90210',
            dateOfBirth: new Date('1975-06-20'),
            occupation: 'Senior Financial Advisor',
            employerOrBusiness: 'Wealth Management LLC',
            linkedinProfile: 'https://linkedin.com/in/sarahjohnson',
            companyRegistrationNumber: 'WM987654321',
            knownAssociations: ['Financial Advisors Association', 'Investment Club'],
            comments: 'Experienced financial advisor with excellent track record.',
            recordStatus: 'verified',
            submittedById: user.id
        }
    });
    console.log('✅ Created sample guarantor submissions');
    // Create sample attachments
    await prisma.attachment.upsert({
        where: { id: 'sample-attachment-1' },
        update: {},
        create: {
            id: 'sample-attachment-1',
            filename: 'business_license.pdf',
            fileType: 'application/pdf',
            fileSize: 512000,
            url: 'https://storage.example.com/files/sample-guarantor-1/business_license.pdf',
            guarantorSubmissionId: submission1.id
        }
    });
    await prisma.attachment.upsert({
        where: { id: 'sample-attachment-2' },
        update: {},
        create: {
            id: 'sample-attachment-2',
            filename: 'financial_statement.pdf',
            fileType: 'application/pdf',
            fileSize: 1024000,
            url: 'https://storage.example.com/files/sample-guarantor-2/financial_statement.pdf',
            guarantorSubmissionId: submission2.id
        }
    });
    console.log('✅ Created sample attachments');
}
main()
    .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
