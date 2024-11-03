"use client";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) throw new Error("Login failed");

      const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn, roles } = await response.json();

      if (!accessToken || !refreshToken) {
        message.error("Sai email hoặc mật khẩu.");
        return;
      }

      const accessTokenExpirationTime = new Date().getTime() + accessTokenExpiresIn * 1000;
      const accessTokenExpirationDate = new Date(accessTokenExpirationTime).toLocaleString();
      const refreshTokenExpirationTime = new Date().getTime() + refreshTokenExpiresIn * 1000;
      const refreshTokenExpirationDate = new Date(refreshTokenExpirationTime).toLocaleString();

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("accessTokenExpirationDate", accessTokenExpirationDate);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("refreshTokenExpirationDate", refreshTokenExpirationDate);
      localStorage.setItem("roles", JSON.stringify(roles));

      message.success("Login successful!");
      
      router.push("/profile");
      // Điều hướng dựa trên vai trò của người dùng
      // if (roles.includes("admin")) {
      //   router.push("/admin");
      // } else if (roles.includes("author")) {
      //   router.push("/author");
      // } else {
      //   router.push("/profile");
      // }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen from-indigo-500 to-blue-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-8 text-gray-800">
          Đăng nhập
        </h1>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <a className="text-sm hover:underline" href="/forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <a href="/register" className="hover:underline">
              Đăng ký ngay
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}