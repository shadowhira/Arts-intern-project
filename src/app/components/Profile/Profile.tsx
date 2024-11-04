"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { message, Button, Form, Input } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../../../redux/userSlice';
import { getAccessToken, logout } from '../../../lib/auth';
import AlbumManager from './AlbumManager';
import ImageManager from './ImageManager';

export default function ProfilePage() {
  const [user, setUserState] = useState<any>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken: string | null = await getAccessToken();

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

  const handleEditUser = async (values: any) => {
    const accessToken: string | null = await getAccessToken();
    const response = await fetch("http://127.0.0.1:8000/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUserState(updatedUser);
      dispatch(setUser(updatedUser));
      message.success("Thông tin cá nhân đã được cập nhật.");
    } else {
      message.error("Cập nhật thông tin cá nhân thất bại.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">Welcome, {user.name}!</h2>

      {/* <h3>Chỉnh sửa thông tin cá nhân</h3>
      <Form initialValues={userData} onFinish={handleEditUser}>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form> */}

      <AlbumManager userId={user.id} />
      <ImageManager userId={user.id} />
    </div>
  );
}