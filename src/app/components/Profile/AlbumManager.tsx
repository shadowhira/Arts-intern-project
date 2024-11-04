import { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input } from "antd";
import { getAccessToken } from '../../../lib/auth';
import { PlusOutlined } from "@ant-design/icons";

interface AlbumManagerProps {
  userId: number;
}

export default function AlbumManager({ userId }: AlbumManagerProps) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      const accessToken = await getAccessToken();
      const response = await fetch(`http://127.0.0.1:8000/albums?userId=${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setAlbums(data);
    };

    fetchAlbums();
  }, [userId]);

  const handleAddAlbum = async (values: any) => {
    // Kiểm tra nếu tên album đã tồn tại
    const albumExists = albums.some(album => album.title === values.title);
    if (albumExists) {
      message.error("Tên album đã tồn tại.");
      return;
    }

    const accessToken = await getAccessToken();
    const response = await fetch("http://127.0.0.1:8000/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...values, userId }),
    });

    if (response.ok) {
      const newAlbum = await response.json();
      setAlbums([...albums, newAlbum]);
      message.success("Album đã được thêm.");
      setIsModalVisible(false);
    } else {
      message.error("Thêm album thất bại.");
    }
  };

  const handleEditAlbum = async (values: any) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`http://127.0.0.1:8000/albums/${editingAlbum.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const updatedAlbum = await response.json();
      setAlbums(albums.map(album => album.id === updatedAlbum.id ? updatedAlbum : album));
      message.success("Album đã được cập nhật.");
      setIsModalVisible(false);
    } else {
      message.error("Cập nhật album thất bại.");
    }
  };

  const handleDeleteAlbum = async (id: number) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`http://127.0.0.1:8000/albums/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      setAlbums(albums.filter(album => album.id !== id));
      message.success("Album đã được xóa.");
    } else {
      message.error("Xóa album thất bại.");
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (text: any, record: any) => (
        <span>
          <Button onClick={() => { setEditingAlbum(record); setIsModalVisible(true); }}>Sửa</Button>
          <Button onClick={() => handleDeleteAlbum(record.id)}>Xóa</Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h3>Quản lý album</h3>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingAlbum(null); setIsModalVisible(true); }}>
        Thêm album
      </Button>
      <Table dataSource={albums} columns={columns} rowKey="id" />

      <Modal
        title={editingAlbum ? "Sửa album" : "Thêm album"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingAlbum || { title: '' }}
          onFinish={editingAlbum ? handleEditAlbum : handleAddAlbum}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editingAlbum ? "Cập nhật" : "Thêm"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}