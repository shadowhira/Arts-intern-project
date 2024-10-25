"use client";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Login failed");

      const { token } = await response.json();
      localStorage.setItem("token", token);  // Lưu JWT vào LocalStorage
      message.success("Login successful!");
      router.push("/profile");
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
