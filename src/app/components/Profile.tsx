"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message, Button } from "antd";
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../../redux/userSlice';
import { getAccessToken, logout } from '../../lib/auth';

export default function ProfilePage() {
  const [user, setUserState] = useState<any>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        message.warning("Phiên đăng nhập đã hết, vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Không lấy được thông tin từ jwt.");
        }

        const data = await response.json();
        setUserState(data);
        dispatch(setUser(data));
      } catch (error: any) {
        message.error("Lỗi khi lấy thông tin người dùng: " + error.message);
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router, dispatch]);

  const handleLogout = () => {
    logout();
    dispatch(clearUser());
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