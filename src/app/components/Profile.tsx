"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message, Button } from "antd";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("accessToken");
  
      if (!token) {
        message.warning("Please login first.");
        router.push("/login");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }
  
        const data = await response.json();
        setUser(data);
      } catch (error) {
        message.error("Failed to fetch user data.");
        router.push("/login");
      }
    };
  
    fetchUserData();
  }, [router]);  

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    message.success("Logged out successfully.");
    router.push("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Welcome, {user.name}!</h2>
      <Button onClick={handleLogout} type="primary">
        Logout
      </Button>
    </div>
  );
}
