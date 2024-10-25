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
    formData.append("file", fileList[0].originFileObj as RcFile);
    formData.append("star", "0"); // Thay đổi theo nhu cầu của bạn
    formData.append("albumId", "album1"); // Thay thế bằng albumId thực tế
    formData.append("userId", "user1"); // Thay thế bằng userId thực tế

    try {
      const response = await fetch("http://localhost:8000/images", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // hoặc application/json tùy loại dữ liệu bạn gửi"
          "Access-Control-Allow-Origin": "*"          
        },  
        body: formData,
      });

      if (!response.ok) {
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
