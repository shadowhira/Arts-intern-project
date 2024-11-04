"use client";

import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { getAccessToken, logout } from "../../../lib/auth";

interface Album {
  id: string;
  title: string;
  userId: string;
}

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string[];
}

interface Image {
  id: string;
  title: string;
  url: string;
  star: number;
  albumId: string;
  userId: string;
  public: boolean;
  width: number;
  height: number;
  status: string;
  album: Album;
  user: User;
}

const ApprovePage: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPendingImages();
  }, []);

  const fetchPendingImages = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      const response = await fetch(
        "http://127.0.0.1:8000/images?status=pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const approveImage = async (id: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(
        `http://127.0.0.1:8000/images/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to approve image");
      }
      message.success("Image approved successfully");
      fetchPendingImages();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const rejectImage = async (id: string) => {
    try {
      const token = await getAccessToken();
      const response = await fetch(
        `http://127.0.0.1:8000/images/${id}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to reject image");
      }
      message.success("Image rejected successfully");
      fetchPendingImages();
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (text: string, record: Image, index: number) => index + 1,
    },
    {
      title: "User",
      dataIndex: ["user", "username"],
      key: "username",
    },
    {
      title: "Image",
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <img src={url} alt="Image" className="w-20 h-20 object-cover" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "Album",
      dataIndex: ["album", "title"],
      key: "albumTitle",
    },

    {
      title: "Actions",
      key: "actions",
      render: (text: string, record: Image) => (
        <div className="flex space-x-2">
          <Button type="primary" onClick={() => approveImage(record.id)}>
            Approve
          </Button>
          <Button danger onClick={() => rejectImage(record.id)}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Approve Images</h1>
      <Table
        columns={columns}
        dataSource={images}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default ApprovePage;
