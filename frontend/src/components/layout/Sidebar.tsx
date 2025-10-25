import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, History, FileText, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

const navigationItems = [
    {
        title: 'Dashboard',
        href: '/',
        icon: Home,
        description: 'Overview and statistics'
    },
    {
        title: 'New Submission',
        href: '/new-submission',
        icon: Plus,
        description: 'Create guarantor submission'
    },
    {
        title: 'Submission History',
        href: '/history',
        icon: History,
        description: 'View all submissions'
    }
];

export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <div
            className={cn('flex flex-col border-r bg-gray-50 transition-all duration-300', collapsed ? 'w-16' : 'w-64')}
        >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b'>
                {!collapsed && (
                    <div className='flex items-center gap-2'>
                        <Shield className='h-6 w-6 text-blue-600' />
                        <div>
                            <h2 className='font-semibold text-gray-900'>Guarantor Collector</h2>
                            <p className='text-xs text-gray-600'>Background Check System</p>
                        </div>
                    </div>
                )}
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setCollapsed(!collapsed)}
                    className='ml-auto'
                >
                    {collapsed ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className='flex-1 p-4'>
                <div className='space-y-2'>
                    {navigationItems.map(item => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                            >
                                <div
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                                        'hover:bg-gray-100',
                                        isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-700'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'h-4 w-4 flex-shrink-0',
                                            isActive ? 'text-blue-600' : 'text-gray-500'
                                        )}
                                    />
                                    {!collapsed && (
                                        <div className='flex-1 min-w-0'>
                                            <div className='font-medium truncate'>{item.title}</div>
                                            <div className='text-xs text-gray-500 truncate'>{item.description}</div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {!collapsed && (
                    <>
                        <Separator className='my-4' />

                        <div className='mt-6'>
                            <h3 className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                                Quick Actions
                            </h3>
                            <div className='space-y-1'>
                                <Link to='/new-submission'>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='w-full justify-start'
                                    >
                                        <Plus className='mr-2 h-3 w-3' />
                                        New Guarantor
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className='mt-auto pt-8'>
                            <div className='bg-blue-50 rounded-lg p-3 border border-blue-200'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <FileText className='h-4 w-4 text-blue-600' />
                                    <span className='text-sm font-medium text-blue-900'>Data Export</span>
                                </div>
                                <p className='text-xs text-blue-700 mb-2'>Export submission data for analysis</p>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='w-full text-blue-700 border-blue-300'
                                >
                                    Export Data
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
};
