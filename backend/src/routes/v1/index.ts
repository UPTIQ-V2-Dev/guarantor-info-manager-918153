import config from '../../config/config.ts';
import attachmentsRoute from './attachments.route.ts';
import authRoute from './auth.route.ts';
import dashboardRoute from './dashboard.route.ts';
import docsRoute from './docs.route.ts';
import guarantorRoute from './guarantor.route.ts';
import mcpRoute from './mcp.route.ts';
import submissionsRoute from './submissions.route.ts';
import userRoute from './user.route.ts';
import express from 'express';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/mcp',
        route: mcpRoute
    },
    {
        path: '/api/guarantor',
        route: guarantorRoute
    },
    {
        path: '/api/submissions',
        route: submissionsRoute
    },
    {
        path: '/api/attachments',
        route: attachmentsRoute
    },
    {
        path: '/api/dashboard',
        route: dashboardRoute
    }
];

const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute
    }
];

defaultRoutes.forEach(route => {
    router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
    devRoutes.forEach(route => {
        router.use(route.path, route.route);
    });
}

export default router;
