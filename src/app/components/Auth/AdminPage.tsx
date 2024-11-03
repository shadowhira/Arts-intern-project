"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Spin } from "antd";
import { getAccessToken, logout } from "../../../lib/auth";
import { useRouter } from 'next/navigation';
interface User {
  id: string;
  username: string;
  email: string;
  role: string[];
  password?: string; // Thêm trường password, nhưng không bắt buộc
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const router = useRouter();

  const fetchUsers = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      message.warning("Session expired. Please log in again.");
      logout();
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setIsModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      message.warning("Session expired. Please log in again.");
      logout();
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: () => handleDelete(id),
      onCancel: () => {},
    });
  };

  const handleOk = async (values: Partial<User>) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      message.warning("Session expired. Please log in again.");
      logout();
      return;
    }

    // Ensure role is an array
    if (typeof values.role === 'string') {
      values.role = [values.role];
    }

    try {
      if (currentUser) {
        const response = await fetch(
          `http://127.0.0.1:8000/users/${currentUser.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(values),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        message.success("User updated successfully");
      } else {
        const response = await fetch("http://127.0.0.1:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        message.success("User created successfully");
      }
      fetchUsers();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to save user");
    }
  };

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

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string[]) => role.join(", "), // Hoặc bất kỳ dấu phân cách nào bạn muốn
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: User) => (
        <span>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => confirmDelete(record.id)} danger>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Admin Page</h1>
      <Button type="primary" onClick={handleCreate} className="mb-4">
        Create User
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title={currentUser ? "Edit User" : "Create User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={
            currentUser || { username: "", email: "", role: ["user"] }
          }
          onFinish={handleOk}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input 
              onBlur={(e) => checkEmail(e.target.value)} 
              suffix={checkingEmail && <Spin size="small" />} // Hiển thị loading khi kiểm tra email
            />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select mode="multiple">
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="author">Author</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>
          {!currentUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {currentUser ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;