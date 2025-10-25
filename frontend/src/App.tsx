import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { NewSubmissionPage } from '@/pages/NewSubmissionPage';
import { SubmissionHistoryPage } from '@/pages/SubmissionHistoryPage';
import { SubmissionDetailsPage } from '@/pages/SubmissionDetailsPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000 // 5 minutes
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route
                        path='/'
                        element={<AppLayout />}
                    >
                        <Route
                            index
                            element={<DashboardPage />}
                        />
                        <Route
                            path='new-submission'
                            element={<NewSubmissionPage />}
                        />
                        <Route
                            path='history'
                            element={<SubmissionHistoryPage />}
                        />
                        <Route
                            path='submission/:id'
                            element={<SubmissionDetailsPage />}
                        />
                        <Route
                            path='*'
                            element={
                                <ComingSoonPage
                                    title='Page Not Found'
                                    description="The page you're looking for doesn't exist."
                                />
                            }
                        />
                    </Route>
                </Routes>
                <Toaster />
            </BrowserRouter>
        </QueryClientProvider>
    );
};
