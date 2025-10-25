import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        // Redirect to dashboard after successful login
        navigate('/');
    };

    return (
        <AuthLayout
            title='Welcome back'
            subtitle='Sign in to your account to continue'
        >
            <LoginForm onSuccess={handleLoginSuccess} />
        </AuthLayout>
    );
};
