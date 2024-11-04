"use client";

import Image from "next/image";
import { StarOutlined, UserOutlined, PictureOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; 
import { message, Button } from "antd";

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
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.user);

  if (!width || !height) {
    return null;
  }

  const widthHeightRatio = height / width;
  const galleryHeight = Math.ceil(250 * widthHeightRatio);
  const photoSpans = Math.ceil(galleryHeight / 10) + 1;

  const handleFollow = async () => {
    if (!currentUser) {
      message.warning("Please log in to follow users.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/follows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to follow user.");
      }

      message.success("Followed user successfully.");
    } catch (error) {
      message.error((error as Error).message);
    }
  };

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
          <Button
            onClick={handleFollow}
            type="primary"
            className="px-2 py-1 rounded"
          >
            Follow
          </Button>
        </div>
      </div>
    </div>
  );
}