"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../../../lib/auth';

const Logout: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        // Clear local storage
        localStorage.clear();

        // Call logout function from auth library
        logout();

        // Redirect to login page
        router.push('/login');
    }, [router]);

    return null;
};

export default Logout;