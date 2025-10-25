import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, MapPin, Briefcase, User, Calendar, Building, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { guarantorService } from '@/services/guarantor';

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'verified':
            return 'default';
        case 'pending_verification':
            return 'secondary';
        case 'rejected':
            return 'destructive';
        default:
            return 'outline';
    }
};

const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const SubmissionDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: submission,
        isLoading,
        error
    } = useQuery({
        queryKey: ['guarantor', id],
        queryFn: () => guarantorService.getById(id!),
        enabled: !!id
    });

    if (isLoading) {
        return (
            <div className='p-6 space-y-6'>
                <div className='flex items-center gap-4'>
                    <Skeleton className='h-10 w-10' />
                    <div>
                        <Skeleton className='h-8 w-64' />
                        <Skeleton className='h-4 w-96 mt-2' />
                    </div>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className='h-6 w-32' />
                            </CardHeader>
                            <CardContent className='space-y-2'>
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-3/4' />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className='p-6'>
                <Card>
                    <CardContent className='pt-6'>
                        <div className='text-center'>
                            <p className='text-lg font-medium text-gray-900'>Submission not found</p>
                            <p className='text-gray-600 mt-2 mb-4'>
                                The submission you're looking for doesn't exist or has been removed.
                            </p>
                            <Button onClick={() => navigate('/history')}>
                                <ArrowLeft className='mr-2 h-4 w-4' />
                                Back to History
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='p-6 space-y-6'>
            {/* Header */}
            <div className='flex items-start justify-between'>
                <div className='flex items-center gap-4'>
                    <Button
                        variant='ghost'
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className='h-4 w-4' />
                    </Button>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-900'>{submission.guarantor_name}</h1>
                        <p className='text-gray-600 mt-1'>{submission.relationship_to_borrower}</p>
                    </div>
                    <Badge
                        variant={getStatusBadgeVariant(submission.record_status)}
                        className='ml-4'
                    >
                        {formatStatus(submission.record_status)}
                    </Badge>
                </div>

                <div className='flex gap-2'>
                    <Button variant='outline'>
                        <Download className='mr-2 h-4 w-4' />
                        Export
                    </Button>
                    <Button variant='outline'>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit
                    </Button>
                </div>
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <User className='h-5 w-5' />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <label className='text-sm font-medium text-gray-600'>Full Name</label>
                            <p className='text-sm text-gray-900'>{submission.guarantor_name}</p>
                        </div>

                        <div>
                            <label className='text-sm font-medium text-gray-600'>Date of Birth</label>
                            <p className='text-sm text-gray-900 flex items-center gap-2'>
                                <Calendar className='h-4 w-4' />
                                {formatDate(submission.date_of_birth)}
                            </p>
                        </div>

                        <div>
                            <label className='text-sm font-medium text-gray-600'>Relationship to Borrower</label>
                            <p className='text-sm text-gray-900'>{submission.relationship_to_borrower}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <MapPin className='h-5 w-5' />
                            Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <p className='text-sm text-gray-900'>{submission.address.street}</p>
                        <p className='text-sm text-gray-900'>
                            {submission.address.city}, {submission.address.state} {submission.address.zip}
                        </p>
                    </CardContent>
                </Card>

                {/* Employment Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Briefcase className='h-5 w-5' />
                            Employment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div>
                            <label className='text-sm font-medium text-gray-600'>Occupation</label>
                            <p className='text-sm text-gray-900'>{submission.occupation}</p>
                        </div>

                        <div>
                            <label className='text-sm font-medium text-gray-600'>Employer/Business</label>
                            <p className='text-sm text-gray-900 flex items-center gap-2'>
                                <Building className='h-4 w-4' />
                                {submission.employer_or_business}
                            </p>
                        </div>

                        {submission.linkedin_profile && (
                            <div>
                                <label className='text-sm font-medium text-gray-600'>LinkedIn Profile</label>
                                <a
                                    href={submission.linkedin_profile}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2'
                                >
                                    View Profile
                                    <ExternalLink className='h-3 w-3' />
                                </a>
                            </div>
                        )}

                        {submission.company_registration_number && (
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Registration Number</label>
                                <p className='text-sm text-gray-900'>{submission.company_registration_number}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Known Associations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Known Associations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submission.known_associations && submission.known_associations.length > 0 ? (
                            <div className='space-y-2'>
                                {submission.known_associations.map((association, index) => (
                                    <div
                                        key={index}
                                        className='bg-gray-50 px-3 py-2 rounded text-sm'
                                    >
                                        {association}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-sm text-gray-500'>No associations listed</p>
                        )}
                    </CardContent>
                </Card>

                {/* Attachments */}
                {submission.attachments && submission.attachments.length > 0 && (
                    <Card className='md:col-span-2'>
                        <CardHeader>
                            <CardTitle>Attachments</CardTitle>
                            <CardDescription>{submission.attachments.length} file(s) uploaded</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {submission.attachments.map(attachment => (
                                    <div
                                        key={attachment.id}
                                        className='border rounded-lg p-4'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='flex-shrink-0'>
                                                <div className='h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center'>
                                                    <Download className='h-5 w-5 text-blue-600' />
                                                </div>
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='text-sm font-medium text-gray-900 truncate'>
                                                    {attachment.filename}
                                                </p>
                                                <p className='text-xs text-gray-500'>
                                                    {formatFileSize(attachment.fileSize)} •{' '}
                                                    {formatDate(attachment.uploadedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='w-full mt-3'
                                        >
                                            <Download className='mr-2 h-3 w-3' />
                                            Download
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Comments */}
                {submission.comments && (
                    <Card className='md:col-span-2'>
                        <CardHeader>
                            <CardTitle>Comments & Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-gray-900 whitespace-pre-wrap'>{submission.comments}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Submission Metadata */}
                <Card className='md:col-span-2'>
                    <CardHeader>
                        <CardTitle>Submission Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-4 md:grid-cols-3'>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Submitted</label>
                                <p className='text-sm text-gray-900'>
                                    {formatDateTime(submission.submission_timestamp)}
                                </p>
                            </div>

                            <div>
                                <label className='text-sm font-medium text-gray-600'>Submitted By</label>
                                <p className='text-sm text-gray-900'>{submission.submitted_by}</p>
                            </div>

                            <div>
                                <label className='text-sm font-medium text-gray-600'>Last Updated</label>
                                <p className='text-sm text-gray-900'>{formatDateTime(submission.last_updated)}</p>
                            </div>
                        </div>

                        <Separator className='my-4' />

                        <div>
                            <label className='text-sm font-medium text-gray-600'>Submission ID</label>
                            <p className='text-xs text-gray-500 font-mono'>{submission.id}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
