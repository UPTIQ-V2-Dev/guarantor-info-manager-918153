import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { guarantorFormSchema, GuarantorFormData } from '@/lib/validations';
import { guarantorService } from '@/services/guarantor';

const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'IL', label: 'Illinois' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'WA', label: 'Washington' }
];

export const SimpleGuarantorForm = () => {
    const [knownAssociations, setKnownAssociations] = useState<string[]>([]);
    const [newAssociation, setNewAssociation] = useState('');

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<GuarantorFormData>({
        resolver: zodResolver(guarantorFormSchema),
        defaultValues: {
            guarantor_name: '',
            relationship_to_borrower: '',
            address: {
                street: '',
                city: '',
                state: '',
                zip: ''
            },
            date_of_birth: '',
            occupation: '',
            employer_or_business: '',
            linkedin_profile: '',
            company_registration_number: '',
            known_associations: [],
            comments: ''
        }
    });

    const submitMutation = useMutation({
        mutationFn: (data: GuarantorFormData) =>
            guarantorService.submit({
                ...data,
                known_associations: knownAssociations
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guarantors'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            navigate('/history');
        }
    });

    const onSubmit = (data: GuarantorFormData) => {
        submitMutation.mutate({
            ...data,
            known_associations: knownAssociations
        });
    };

    const addAssociation = () => {
        if (newAssociation.trim() && !knownAssociations.includes(newAssociation.trim())) {
            setKnownAssociations([...knownAssociations, newAssociation.trim()]);
            setNewAssociation('');
        }
    };

    const removeAssociation = (index: number) => {
        setKnownAssociations(knownAssociations.filter((_, i) => i !== index));
    };

    const isLoading = submitMutation.isPending;
    const error = submitMutation.error;

    return (
        <div className='max-w-4xl mx-auto p-6'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-gray-900'>New Guarantor Submission</h1>
                <p className='text-gray-600 mt-2'>
                    Collect and organize guarantor information for background verification
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Basic personal details of the guarantor</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='guarantor_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Enter full legal name'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='relationship_to_borrower'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                            Relationship to Borrower
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='e.g., Personal guarantor for BlueRock Holdings LLC'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='date_of_birth'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                            Date of Birth
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='date'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address Information</CardTitle>
                            <CardDescription>Current address details</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='address.street'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                            Street Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='123 Main Street'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='address.city'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                                City
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='Phoenix'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='address.state'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                                State
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select state' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {US_STATES.map(state => (
                                                        <SelectItem
                                                            key={state.value}
                                                            value={state.value}
                                                        >
                                                            {state.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='address.zip'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                                ZIP Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder='85001'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Employment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Employment Information</CardTitle>
                            <CardDescription>Professional background and business details</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='occupation'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                            Occupation/Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Real Estate Investor'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='employer_or_business'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="after:content-['*'] after:text-red-500 after:ml-1">
                                            Employer or Business Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Davis Capital Group'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='linkedin_profile'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LinkedIn Profile</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='url'
                                                placeholder='https://www.linkedin.com/in/username'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='company_registration_number'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Registration Number / EIN</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='AZ-LLC-2018-001234'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Known Associations */}
                            <div className='space-y-2'>
                                <FormLabel>Known Associations</FormLabel>
                                <div className='flex gap-2'>
                                    <Input
                                        value={newAssociation}
                                        onChange={e => setNewAssociation(e.target.value)}
                                        placeholder='Enter business affiliation, board membership, etc.'
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAssociation())}
                                    />
                                    <Button
                                        type='button'
                                        onClick={addAssociation}
                                        variant='outline'
                                    >
                                        Add
                                    </Button>
                                </div>
                                {knownAssociations.length > 0 && (
                                    <div className='space-y-1'>
                                        {knownAssociations.map((association, index) => (
                                            <div
                                                key={index}
                                                className='flex items-center justify-between bg-gray-50 px-3 py-2 rounded'
                                            >
                                                <span className='text-sm'>{association}</span>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    onClick={() => removeAssociation(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name='comments'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comments or Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder='Additional comments from loan officer...'
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {error && (
                        <Alert variant='destructive'>
                            <AlertDescription>
                                {error.message || 'Failed to submit guarantor information. Please try again.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className='flex justify-between pt-4'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => navigate(-1)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Save className='mr-2 h-4 w-4' />
                                    Submit Guarantor
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
