"use client";

import React, { useEffect, useState } from "react";
import { message, Table, Select, Form } from "antd";
import { getAccessToken, logout } from "../../../lib/auth";
import { useRouter } from "next/navigation";

const { Option } = Select;

const AuthorPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchTokenAndUsers = async () => {
      const token = await getAccessToken();
      if (!token) {
        message.error("Please login first.");
        router.push("/login");
      } else {
        setToken(token);
        fetchUsers(token);
      }
    };

    fetchTokenAndUsers();
  }, []);

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users.");
    }
  };

  const handleRoleChange = async (userId: number, newRole: string[]) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (response.ok) {
        message.success("Role updated successfully.");
        fetchUsers(token!);
      } else {
        message.error("Failed to update role.");
      }
    } catch (error) {
      message.error("Failed to update role.");
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: string[], record: any) => (
        <Form.Item>
          <Select
            mode="multiple"
            defaultValue={text}
            onChange={(value) => handleRoleChange(record.id, value)}
          >
            <Option value="user">User</Option>
            <Option value="author">Author</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Author Page</h1>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default AuthorPage;