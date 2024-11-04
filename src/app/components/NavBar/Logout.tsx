"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../../lib/auth";
import { Button } from "antd";

const Logout: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
