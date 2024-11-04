import React, { useState, useEffect } from "react";
import Link from "next/link";
import Notification from "./NavBar/Notification";
import Search from "./NavBar/Search";
import SideBar from "./NavBar/SideBar";
import Theme from "./NavBar/Theme";
import Logout from "./NavBar/Logout";
import { Layout, Typography, Button } from "antd";

const { Header } = Layout;
const { Title } = Typography;

interface NavBarProps {
  onThemeChange: (newTokens: Partial<{ colorPrimary: string; borderRadius: number; colorBgContainer: string }>) => void;
}

export default function NavBar({ onThemeChange }: NavBarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Header className="bg-slate-300 dark:bg-gray-800 sticky top-0 z-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center p-4 font-bold max-w-6xl mx-auto text-black dark:text-white">
        <div className="flex items-center gap-4">
          <SideBar />
          <Title level={2} className="text-2xl sm:text-3xl text-center whitespace-nowrap text-black dark:text-white">
            <Link href="/">Mom's Image Gallery</Link>
          </Title>
        </div>
        <div className="flex items-center gap-4">
          <Search />
          <Theme onThemeChange={onThemeChange} />
          <Notification />
          {isLoggedIn ? (
            <Logout />
          ) : (
            <Button type="primary">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
}
