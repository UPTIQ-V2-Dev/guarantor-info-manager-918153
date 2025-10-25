import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Download, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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

const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const SubmissionHistoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ['guarantors', 'list', { search: searchTerm, status: statusFilter, page: currentPage }],
        queryFn: () =>
            guarantorService.getList({
                search: searchTerm || undefined,
                status: statusFilter || undefined,
                page: currentPage,
                limit: 10
            })
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value === 'all' ? '' : value);
        setCurrentPage(1); // Reset to first page on filter
    };

    const handleExport = () => {
        // In a real app, this would trigger a download
        console.log('Exporting data...');
    };

    return (
        <div className='p-6 space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Submission History</h1>
                    <p className='text-gray-600 mt-1'>View and manage all guarantor submissions</p>
                </div>
                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        onClick={handleExport}
                    >
                        <Download className='mr-2 h-4 w-4' />
                        Export
                    </Button>
                    <Link to='/new-submission'>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' />
                            New Submission
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Filter className='h-5 w-5' />
                        Search & Filters
                    </CardTitle>
                    <CardDescription>Find specific submissions using search and filters</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='relative flex-1'>
                            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                placeholder='Search by name, relationship, or occupation...'
                                value={searchTerm}
                                onChange={handleSearch}
                                className='pl-8'
                            />
                        </div>
                        <Select
                            value={statusFilter || 'all'}
                            onValueChange={handleStatusFilter}
                        >
                            <SelectTrigger className='w-full sm:w-[200px]'>
                                <SelectValue placeholder='Filter by status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>All Statuses</SelectItem>
                                <SelectItem value='pending_verification'>Pending Verification</SelectItem>
                                <SelectItem value='verified'>Verified</SelectItem>
                                <SelectItem value='rejected'>Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Submissions</CardTitle>
                    <CardDescription>
                        {data ? `${data.total} total submissions` : 'Loading submissions...'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className='space-y-2'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className='h-16 bg-gray-100 rounded animate-pulse'
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <div className='text-center py-8'>
                            <p className='text-lg font-medium text-gray-900'>Error loading submissions</p>
                            <p className='text-gray-600 mt-2'>{error.message || 'Something went wrong'}</p>
                        </div>
                    ) : data?.data && data.data.length > 0 ? (
                        <>
                            <div className='rounded-md border'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Guarantor Name</TableHead>
                                            <TableHead>Relationship</TableHead>
                                            <TableHead>Occupation</TableHead>
                                            <TableHead>Submitted</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted By</TableHead>
                                            <TableHead className='w-[70px]'>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.data.map((submission: GuarantorSubmission) => (
                                            <TableRow key={submission.id}>
                                                <TableCell className='font-medium'>
                                                    {submission.guarantor_name}
                                                </TableCell>
                                                <TableCell className='max-w-[200px] truncate'>
                                                    {submission.relationship_to_borrower}
                                                </TableCell>
                                                <TableCell>{submission.occupation}</TableCell>
                                                <TableCell>{formatDate(submission.submission_timestamp)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusBadgeVariant(submission.record_status)}>
                                                        {formatStatus(submission.record_status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='text-muted-foreground'>
                                                    {submission.submitted_by}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                            >
                                                                <MoreHorizontal className='h-4 w-4' />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align='end'>
                                                            <DropdownMenuItem asChild>
                                                                <Link to={`/submission/${submission.id}`}>
                                                                    <Eye className='mr-2 h-4 w-4' />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {data.total > 10 && (
                                <div className='flex items-center justify-between mt-4'>
                                    <p className='text-sm text-muted-foreground'>
                                        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, data.total)}{' '}
                                        of {data.total} submissions
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            disabled={currentPage * 10 >= data.total}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='text-center py-8'>
                            <p className='text-lg font-medium text-gray-900'>No submissions found</p>
                            <p className='text-gray-600 mt-2 mb-4'>
                                {searchTerm || statusFilter
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by creating your first submission'}
                            </p>
                            {!searchTerm && !statusFilter && (
                                <Link to='/new-submission'>
                                    <Button>
                                        <Plus className='mr-2 h-4 w-4' />
                                        Create Submission
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
