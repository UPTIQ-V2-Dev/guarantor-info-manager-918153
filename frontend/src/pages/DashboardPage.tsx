import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { guarantorService } from '@/services/guarantor';
import type { GuarantorSubmission } from '@/types/guarantor';

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

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'verified':
            return <CheckCircle className='h-4 w-4' />;
        case 'pending_verification':
            return <Clock className='h-4 w-4' />;
        case 'rejected':
            return <XCircle className='h-4 w-4' />;
        default:
            return null;
    }
};

const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const DashboardPage = () => {
    const {
        data: dashboardData,
        isLoading,
        error
    } = useQuery({
        queryKey: ['dashboard'],
        queryFn: guarantorService.getDashboardStats
    });

    if (isLoading) {
        return (
            <div className='p-6 space-y-6'>
                <div className='flex justify-between items-center'>
                    <div>
                        <Skeleton className='h-8 w-64' />
                        <Skeleton className='h-4 w-96 mt-2' />
                    </div>
                    <Skeleton className='h-10 w-32' />
                </div>

                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className='h-4 w-24' />
                                <Skeleton className='h-8 w-16' />
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader>
                        <Skeleton className='h-6 w-48' />
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-2'>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className='h-12 w-full'
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className='p-6'>
                <Card>
                    <CardContent className='pt-6'>
                        <div className='text-center'>
                            <XCircle className='mx-auto h-12 w-12 text-red-500 mb-4' />
                            <p className='text-lg font-medium text-gray-900'>Unable to load dashboard</p>
                            <p className='text-gray-600 mt-2'>
                                {error.message || 'Something went wrong. Please try again later.'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className='p-6 space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Guarantor Dashboard</h1>
                    <p className='text-gray-600 mt-1'>Manage and track guarantor background information submissions</p>
                </div>
                <Link to='/new-submission'>
                    <Button>
                        <Plus className='mr-2 h-4 w-4' />
                        New Submission
                    </Button>
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Submissions</CardTitle>
                        <Users className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dashboardData?.total_submissions || 0}</div>
                        <p className='text-xs text-muted-foreground'>All time submissions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Pending Verification</CardTitle>
                        <Clock className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dashboardData?.pending_verification || 0}</div>
                        <p className='text-xs text-muted-foreground'>Awaiting review</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Verified</CardTitle>
                        <CheckCircle className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dashboardData?.verified || 0}</div>
                        <p className='text-xs text-muted-foreground'>Successfully verified</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Rejected</CardTitle>
                        <XCircle className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{dashboardData?.rejected || 0}</div>
                        <p className='text-xs text-muted-foreground'>Failed verification</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Submissions */}
            <Card>
                <CardHeader>
                    <div className='flex items-center justify-between'>
                        <div>
                            <CardTitle>Recent Submissions</CardTitle>
                            <CardDescription>Latest guarantor information submissions</CardDescription>
                        </div>
                        <Link to='/history'>
                            <Button
                                variant='outline'
                                size='sm'
                            >
                                View All
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {dashboardData?.recent_submissions && dashboardData.recent_submissions.length > 0 ? (
                        <div className='rounded-md border'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Guarantor Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='w-[70px]'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dashboardData.recent_submissions.map((submission: GuarantorSubmission) => (
                                        <TableRow key={submission.id}>
                                            <TableCell className='font-medium'>{submission.guarantor_name}</TableCell>
                                            <TableCell className='max-w-[200px] truncate'>
                                                {submission.relationship_to_borrower}
                                            </TableCell>
                                            <TableCell>{formatDate(submission.submission_timestamp)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusBadgeVariant(submission.record_status)}
                                                    className='gap-1'
                                                >
                                                    {getStatusIcon(submission.record_status)}
                                                    {formatStatus(submission.record_status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Link to={`/submission/${submission.id}`}>
                                                    <Button
                                                        variant='ghost'
                                                        size='sm'
                                                    >
                                                        <Eye className='h-4 w-4' />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className='text-center py-8'>
                            <Users className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                            <p className='text-lg font-medium text-gray-900'>No submissions yet</p>
                            <p className='text-gray-600 mt-2 mb-4'>
                                Get started by creating your first guarantor submission
                            </p>
                            <Link to='/new-submission'>
                                <Button>
                                    <Plus className='mr-2 h-4 w-4' />
                                    Create Submission
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
