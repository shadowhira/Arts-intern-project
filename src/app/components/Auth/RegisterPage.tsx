"use client";
import { Form, Input, Button, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false); // Kiểm tra email

  // Kiểm tra email đã tồn tại khi người dùng rời khỏi ô nhập email
  const checkEmail = async (email: string) => {
    setCheckingEmail(true);
  
    try {
      const res = await fetch('http://127.0.0.1:8000/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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

  const onFinish = async (values: any) => {
    setLoading(true);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          email: values.email,
        }),
      });
  
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Đăng ký thất bại!');
      }
  
      message.success('Đăng ký thành công!');
      router.push('/login');
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Đăng ký tài khoản</h1>

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
            label="Tài khoản"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
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
            dependencies={['password']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
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
              Đăng ký
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
