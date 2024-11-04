import React, { useState } from "react";
import { Button } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

interface ThemeProps {
  onThemeChange: (newTokens: { colorPrimary: string; borderRadius?: number; colorBgContainer?: string }) => void;
}

export default function Theme({ onThemeChange }: ThemeProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleClick = () => {
    setIsDarkMode(!isDarkMode);
    const newColor = isDarkMode ? "#00b96b" : "#ff4d4f"; 
    const newTokens = {
      colorPrimary: newColor,
      borderRadius: isDarkMode ? 8 : 2, 
      colorBgContainer: isDarkMode ? "#39eacf" : "#f6ffed", 
    };
    onThemeChange(newTokens);
  };

  return (
    <Button
      shape="circle"
      icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        backgroundColor: isDarkMode ? "#4a5568" : "#e2e8f0",
      }}
    />
  );
}
