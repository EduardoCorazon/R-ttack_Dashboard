// @ts-nocheck
import {useEffect, useState} from 'react';
import {authenticateTest} from '@/components/Authentication/useClient';

const AuthenticatedRoute = (WrappedComponent) => {
    const AuthRouteWrapper = (props) => {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        useEffect(() => {
            const checkAuthentication = async () => {
                try {
                    const authenticatedUser = await authenticateTest();
                    if (authenticatedUser) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                        window.location.href = '/login';
                    }
                } catch (error) {
                    console.error('Error checking authentication:', error);
                    setIsAuthenticated(false);
                    window.location.href = '/login';
                }
            };
            checkAuthentication();
        }, []);
        return isAuthenticated ? <WrappedComponent {...props} /> : null;
    };
    return AuthRouteWrapper;
};

export default AuthenticatedRoute;