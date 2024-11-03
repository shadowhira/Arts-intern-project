"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../../../lib/auth';

const Logout: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        localStorage.clear();

        logout();

        router.push('/login');
    }, [router]);

    return null;
};

export default Logout;