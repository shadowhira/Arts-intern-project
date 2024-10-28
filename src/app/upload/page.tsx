"use client";
import { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message, Select, Modal } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

const { Option } = Select;

export default function UploadPage() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [albums, setAlbums] = useState<{ id: string; title: string }[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  useEffect(() => {
    // Fetch albums from API
    const fetchAlbums = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/albums");
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  const handleUpload = async (values: { title: string }) => {
    if (fileList.length === 0) {
      message.warning("Please select a photo to upload.");
      return;
    }

    if (!selectedAlbum) {
      message.warning("Please select an album.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("file", fileList[0].originFileObj as RcFile);
    formData.append("star", "0");
    formData.append("albumId", selectedAlbum);
    formData.append("userId", "671a0078324b3e492878c6bb"); // Thay thế bằng userId thực tế

    try {
      const response = await fetch("http://127.0.0.1:8000/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to upload");
      }

      message.success("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Upload failed. Please try again.");
    }
  };

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const handleAlbumChange = (value: string) => {
    setSelectedAlbum(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      // Tạo đối tượng FormData và thêm dữ liệu
      const formData = new FormData();
      formData.append('title', newAlbumTitle);
      formData.append('userId', '671a0078324b3e492878c6bb'); // Thay bằng userId thực tế
  
      // Gửi request với 'multipart/form-data' tự động từ FormData
      const response = await fetch("http://127.0.0.1:8000/albums", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to create album");
      }
  
      const newAlbum = await response.json();
      setAlbums([...albums, newAlbum]);
      setSelectedAlbum(newAlbum.id);
      message.success("Album created successfully!");
    } catch (error) {
      console.error("Failed to create album:", error);
      message.error("Failed to create album. Please try again.");
    }
  
    setIsModalVisible(false);
    setNewAlbumTitle("");
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    setNewAlbumTitle("");
  };

  return (
    <Form onFinish={handleUpload}>
      <Form.Item
        name="title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input placeholder="Title" />
      </Form.Item>
      <Form.Item>
        <Upload
          accept="image/*"
          listType="picture"
          fileList={fileList}
          maxCount={1}
          onChange={handleChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Select Photo</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Select
          placeholder="Select Album"
          onChange={handleAlbumChange}
          value={selectedAlbum}
        >
          {albums.map((album) => (
            <Option key={album.id} value={album.id}>
              {album.title}
            </Option>
          ))}
        </Select>
        <Button type="link" icon={<PlusOutlined />} onClick={showModal}>
          Create New Album
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Upload
        </Button>
      </Form.Item>
      <Modal
        title="Create New Album"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Album Title"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
        />
      </Modal>
    </Form>
  );
}