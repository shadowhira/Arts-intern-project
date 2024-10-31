import { useState } from "react";
import { Form, Input, Upload, Button, message, Select, Modal } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import { getAccessToken, logout } from "../../../lib/auth";

const { Option } = Select;

interface UploadComponentProps {
  albums: { id: string; title: string }[];
  currentUserId: string;
  setAlbums: (albums: { id: string; title: string }[]) => void;
}

export default function UploadComponent({
  albums,
  currentUserId,
  setAlbums,
}: UploadComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

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

      // Create an image element to get dimensions
      const img = new Image();
      img.src = base64File;
      img.onload = async () => {
        const width = img.width;
        const height = img.height;

        const accessToken = await getAccessToken();
        if (!accessToken) {
          message.warning("Session expired. Please log in again.");
          logout();
          return;
        }

        try {
          const response = await fetch("http://127.0.0.1:8000/images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              title: values.title,
              file: base64File.split(",")[1], // Remove "data:image/jpeg;base64,"
              star: 0,
              albumId: selectedAlbum,
              userId: currentUserId, // Use current userId
              public: values.public, // Add public field
              width, // Add width
              height, // Add height
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
    const accessToken = await getAccessToken();
    if (!accessToken) {
      message.warning("Session expired. Please log in again.");
      logout();
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: newAlbumTitle,
          userId: currentUserId, // Use current userId
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
          {Array.isArray(albums) && albums.map((album) => (
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