"use client";
import { useState } from "react";
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";

export default function UploadPage() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = async (values: { title: string }) => {
    if (fileList.length === 0) {
      message.warning("Please select a photo to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("file", fileList[0].originFileObj as RcFile); // Sửa lỗi ở đây
    formData.append("star", "0");
    formData.append("albumId", "album1"); // Thay thế bằng albumId thực tế
    formData.append("userId", "671a0078324b3e492878c6bb"); // Thay thế bằng userId thực tế
    try {
      const response = await fetch("http://127.0.0.1:8000/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); // Lấy thông tin lỗi từ server
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
          beforeUpload={() => false} // Prevents automatic upload
        >
          <Button icon={<UploadOutlined />}>Select Photo</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Upload
        </Button>
      </Form.Item>
    </Form>
  );
}
