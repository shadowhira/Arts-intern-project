"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { getAccessToken, logout } from "../../lib/auth";
import UploadComponent from "../components/Profile/Upload";

export default function UploadPage() {
  const [albums, setAlbums] = useState<{ id: string; title: string }[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch albums from API
    const fetchAlbums = async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        message.warning("Session expired. Please log in again.");
        logout();
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/albums", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  useEffect(() => {
    // Fetch current user from API
    const fetchCurrentUser = async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        message.warning("Session expired. Please log in again.");
        router.push('/login');
        logout();
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }
        const data = await response.json();
        setCurrentUserId(data.id);
      } catch (error) {
        message.error("Failed to fetch current user:" + error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <UploadComponent
      albums={albums}
      currentUserId={currentUserId}
      setAlbums={setAlbums}
    />
  );
}