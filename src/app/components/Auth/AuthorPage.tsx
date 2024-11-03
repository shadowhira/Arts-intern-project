"use client";

import React from "react";
import { message } from "antd";
import { getAccessToken, logout } from "../../../lib/auth";
import { useRouter } from 'next/navigation';


const AuthorPage = () => {
  const router = useRouter();
  const token = localStorage.getItem('accessToken');
  if (!token) {
    message.error('Please login first.')
    router.push('/login');
  }
  return (
    <div>
      <h1>Author Page</h1>
    </div>
  );
};

export default AuthorPage;
