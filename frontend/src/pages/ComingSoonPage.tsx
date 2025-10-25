import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ComingSoonPageProps {
    title?: string;
    description?: string;
}

export const ComingSoonPage = ({
    title = 'Coming Soon',
    description = 'This feature is currently under development and will be available soon.'
}: ComingSoonPageProps) => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-6'>
            <Card className='max-w-md w-full'>
                <CardContent className='pt-6'>
                    <div className='text-center'>
                        <Clock className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                        <h1 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h1>
                        <p className='text-gray-600 mb-6'>{description}</p>
                        <Button onClick={() => navigate(-1)}>
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Go Back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
