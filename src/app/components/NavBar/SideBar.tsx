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
import { Button, Menu, Drawer } from "antd";
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
      <Button
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsOpen(false)}
        visible={isOpen}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          // theme="light"
          onClick={({ key }) => handleNavigation(key)}
          items={[
            {
              key: "/",
              icon: <HomeOutlined />,
              label: "Trang chủ",
            },
            {
              key: "/profile",
              icon: <UserOutlined />,
              label: "Trang profile",
            },
            isAdmin && {
              key: "/admin",
              icon: <SettingOutlined />,
              label: "Trang admin",
            },
            isAuthor && {
              key: "/author",
              icon: <EditOutlined />,
              label: "Trang author",
            },
            isAuthor && {
              key: "/approve",
              icon: <CheckCircleOutlined />,
              label: "Trang phê duyệt",
            },
          ].filter(Boolean)}
        />
      </Drawer>
    </>
  );
}