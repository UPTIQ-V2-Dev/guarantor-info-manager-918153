import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className='min-h-screen flex'>
            <div className='flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24'>
                <div className='w-full max-w-sm lg:w-96'>
                    <div className='mb-8'>
                        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>{title}</h2>
                        {subtitle && <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>
            <div className='hidden lg:block relative flex-1'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700'>
                    <div className='absolute inset-0 bg-black/20' />
                    <div className='relative h-full flex items-center justify-center p-12'>
                        <div className='text-center'>
                            <h1 className='text-4xl font-bold text-white mb-4'>
                                Guarantor Background Information Collector
                            </h1>
                            <p className='text-xl text-blue-100'>Streamline your guarantor verification process</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
