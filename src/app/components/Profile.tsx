"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message, Button } from "antd";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Please login first.");
      router.push("/login");
    } else {
      // Gọi API để lấy thông tin người dùng nếu cần
      fetch("http://localhost:3000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => {
          message.error("Failed to fetch user data.");
          router.push("/login");
        });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
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
