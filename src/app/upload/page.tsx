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

  const handleUpload = async (values: { title: string; public: boolean }) => {
    if (fileList.length === 0) {
      message.warning("Please select a photo to upload.");
      return;
    }

    if (!selectedAlbum) {
      message.warning("Please select an album.");
      return;
    }

    const file = fileList[0].originFileObj as RcFile;
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64File = reader.result as string;

      try {
        const response = await fetch("http://127.0.0.1:8000/images", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: values.title,
            file: base64File.split(",")[1], // Loại bỏ tiền tố "data:image/jpeg;base64,"
            star: 0,
            albumId: selectedAlbum,
            userId: "671a0078324b3e492878c6bb", // Thay thế bằng userId thực tế
            public: values.public, // Thêm trường public
          }),
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

    reader.readAsDataURL(file);
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
      const response = await fetch("http://127.0.0.1:8000/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newAlbumTitle,
          userId: "671a0078324b3e492878c6bb", // Thay bằng userId thực tế
        }),
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
      <Form.Item
        name="public"
        rules={[{ required: true, message: "Please select visibility!" }]}
      >
        <Select placeholder="Select Visibility">
          <Option value={true}>Public</Option>
          <Option value={false}>Private</Option>
        </Select>
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
        open={isModalVisible}
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
