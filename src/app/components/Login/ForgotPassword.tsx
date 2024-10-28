"use client";
import { Form, Input, Button, message, Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Lấy email từ URL
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const checkEmail = async (email: string) => {
    setCheckingEmail(true);
  
    // Prepare the multipart/form-data
    const formData = new FormData();
    formData.append('email', email);
  
    try {
      const res = await fetch('http://127.0.0.1:8000/check-email', {
        method: 'POST',
        body: formData, // Send the email using FormData
      });
  
      const data = await res.json();
      if (data.exists) {
        message.error('Email đã được sử dụng.');
      } else {
        message.success('Email hợp lệ.');
      }
    } catch (error) {
      message.error('Lỗi kiểm tra email.');
    } finally {
      setCheckingEmail(false);
    }
  };  

  // Xử lý đặt lại mật khẩu
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          newPassword: values.password 
        }),
      });

      if (!response.ok) throw new Error("Không thể đặt lại mật khẩu.");

      message.success("Mật khẩu đã được đặt lại thành công!");
      router.push("/login");
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Đặt lại mật khẩu
        </h1>

        <Form onFinish={onFinish} layout="vertical">
        <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
          >
            <Input 
              onBlur={(e) => checkEmail(e.target.value)} 
              suffix={checkingEmail && <Spin size="small" />} // Hiển thị loading khi kiểm tra email
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              Xác nhận
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <a href="/login" className="hover:underline">
              Đăng nhập ngay
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
