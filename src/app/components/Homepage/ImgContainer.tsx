"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { StarOutlined, UserOutlined, PictureOutlined } from "@ant-design/icons";

type Props = {
  photo: {
    id: string;
    title: string;
    url: string;
    star: number;
    public: boolean;
    albumId: string;
    userId: string;
    width: number;
    height: number;
  };
};

export default function ImgContainer({ photo }: Props) {
  const { width, height } = photo;
  const [isHovered, setIsHovered] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchUserName() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/images/${photo.id}/username`);
        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    }

    fetchUserName();
  }, [photo.id]);

  if (!width || !height) {
    return null; // Hoặc hiển thị placeholder trong khi chờ kích thước ảnh
  }

  const widthHeightRatio = height / width;
  const galleryHeight = Math.ceil(250 * widthHeightRatio);
  const photoSpans = Math.ceil(galleryHeight / 10) + 1; // 10 pixel mỗi hàng

  return (
    <div
      className="w-[250px] justify-self-center"
      style={{ gridRow: `span ${photoSpans}` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-xl overflow-hidden group">
        <Image
          src={photo.url}
          alt={photo.title}
          width={250}
          height={galleryHeight}
          sizes="250px"
          className="group-hover:opacity-95 transition-opacity duration-300"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 text-white p-2 flex flex-col justify-end items-start space-y-1 transition-opacity duration-300">
            <div className="flex items-center space-x-1">
              <StarOutlined />
              <span>{photo.star}</span>
            </div>
            <div className="flex items-center space-x-1">
              <PictureOutlined />
              <span>{photo.title}</span>
            </div>
            <div className="flex items-center space-x-1">
              <UserOutlined />
              <span>{userName}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}