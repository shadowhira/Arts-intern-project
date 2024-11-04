import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  EditOutlined,
  MenuOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import "tailwindcss/tailwind.css";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  const isAdmin = user?.roles.includes("admin");
  const isAuthor = user?.roles.includes("author");

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <>
      <button className="text-xl p-2" onClick={() => setIsOpen(!isOpen)}>
        <MenuOutlined />
      </button>
      {isOpen && (
        <div className="fixed top-16 left-0 h-full w-64 bg-gray-800 text-white z-20">
          <div className="flex flex-col items-center mt-10">
            <button
              className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
              onClick={() => handleNavigation("/")}
            >
              <HomeOutlined className="text-xl" />
              <span className="ml-4">Trang chủ</span>
            </button>
            <button
              className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
              onClick={() => handleNavigation("/profile")}
            >
              <UserOutlined className="text-xl" />
              <span className="ml-4">Trang profile</span>
            </button>
            {isAdmin && (
              <button
                className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
                onClick={() => handleNavigation("/admin")}
              >
                <SettingOutlined className="text-xl" />
                <span className="ml-4">Trang admin</span>
              </button>
            )}
            {isAuthor && (
              <button
                className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
                onClick={() => handleNavigation("/author")}
              >
                <EditOutlined className="text-xl" />
                <span className="ml-4">Trang author</span>
              </button>
            )}
            {isAuthor && (
              <button
                className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
                onClick={() => handleNavigation("/approve")}
              >
                <CheckCircleOutlined className="text-xl" />
                <span className="ml-4">Trang phê duyệt</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
