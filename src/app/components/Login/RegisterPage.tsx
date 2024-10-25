"use client";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Registration failed");

      message.success("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
