"use client";

import Image from "next/image";
import { StarOutlined, UserOutlined, PictureOutlined } from "@ant-design/icons";

type Props = {
  id: string;
  title: string;
  url: string;
  star: number;
  public: boolean;
  albumId: string;
  userId: string;
  width: number;
  height: number;
  user: {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string[];
  };
};

export default function ImgContainer({
  id,
  title,
  url,
  star,
  public: isPublic,
  albumId,
  userId,
  width,
  height,
  user,
}: Props) {
  if (!width || !height) {
    return null;
  }

  const widthHeightRatio = height / width;
  const galleryHeight = Math.ceil(250 * widthHeightRatio);
  const photoSpans = Math.ceil(galleryHeight / 10) + 1;

  return (
    <div
      className="w-[250px] justify-self-center"
      style={{ gridRow: `span ${photoSpans}` }}
    >
      <div className="relative rounded-xl overflow-hidden group">
        <Image
          src={url}
          alt={title}
          width={250}
          height={galleryHeight}
          sizes="250px"
          className="group-hover:opacity-95 transition-opacity duration-300"
        />
        {/* Overlay div */}
        <div className="absolute inset-0 bg-black bg-opacity-50 text-white p-2 flex flex-col justify-end items-start space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center space-x-1">
            <StarOutlined />
            <span>{star}</span>
          </div>
          <div className="flex items-center space-x-1">
            <PictureOutlined />
            <span>{title}</span>
          </div>
          <div className="flex items-center space-x-1">
            <UserOutlined />
            <span>{user.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}