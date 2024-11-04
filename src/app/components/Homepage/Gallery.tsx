"use client";

import ImgContainer from "./ImgContainer";
import React, { useState, useEffect, useCallback } from "react";
import Filter from "./Filter";
import { message, Spin, Typography } from "antd";
import { getAccessToken, logout } from "../../../lib/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; // Đảm bảo bạn đã cấu hình store

const { Paragraph } = Typography;

type Image = {
  id: string;
  title: string;
  url: string;
  star: number;
  public: boolean;
  albumId: string;
  userId: string;
  width: number;
  height: number;
  status: string;
  user: {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string[];
  };
};

type Album = {
  id: string;
  title: string;
};

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

  useEffect(() => {
    // Fetch albums to use for filtering
    async function fetchAlbums() {
      const response = await fetch("http://127.0.0.1:8000/albums");
      const albumsData = await response.json();
      setAlbums(albumsData);
    }

    fetchAlbums();
  }, []);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const accessToken = await getAccessToken();
    if (!accessToken) {
      message.warning("Session expired. Please log in again.");
      logout();
      return;
    }

    let url = `http://127.0.0.1:8000/images?publicOnly=true&status=approved&page=${page}&limit=10`;
    if (selectedAlbum) {
      url = `http://127.0.0.1:8000/albums/${selectedAlbum}/images?publicOnly=true&status=approved&page=${page}&limit=10`;
    }
    if (searchTerm) {
      url += `&title=${encodeURIComponent(searchTerm)}`; // Sử dụng encodeURIComponent
    }

    try {
      const response = await fetch(url);
      const newImages = await response.json();

      if (newImages.length === 0) {
        setHasMore(false); // Không còn dữ liệu để tải
      } else {
        setImages((prevImages) => {
          // Dùng Set để loại bỏ các ảnh trùng lặp
          const uniqueImages = new Map(prevImages.map((image) => [image.id, image]));
          newImages.forEach((image: Image) => uniqueImages.set(image.id, image));
          return Array.from(uniqueImages.values());
        }); // Thêm dữ liệu mới vào danh sách
      }
    } catch (error) {
      message.error("Failed to load images.");
    } finally {
      setLoading(false);
    }
  }, [page, selectedAlbum, searchTerm]);

  // Reset images and page when searchTerm changes
  useEffect(() => {
    setImages([]); // Xóa ảnh cũ
    setPage(1); // Đặt lại trang về 1
    setHasMore(true); // Đặt lại trạng thái tải dữ liệu
    fetchImages(); // Gọi lại hàm fetchImages để tải ảnh mới
  }, [searchTerm, selectedAlbum]);

  // Gọi API khi thay đổi bộ lọc album hoặc trang
  useEffect(() => {
    fetchImages();
  }, [page, selectedAlbum, fetchImages]);

  // Xử lý sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (!loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <>
      <Filter
        albums={albums}
        selectedAlbum={selectedAlbum}
        onAlbumChange={(albumId) => {
          setImages([]); // Xóa ảnh cũ khi thay đổi album
          setPage(1); // Đặt lại trang về 1
          setSelectedAlbum(albumId);
          setHasMore(true); // Đặt lại trạng thái tải dữ liệu
        }}
      />
      <section className="px-1 my-3 grid grid-cols-gallery auto-rows-[10px]">
        {images.map((photo) => (
          <ImgContainer key={photo.id} {...photo} />
        ))}
      </section>
      {loading && (
        <div className="flex justify-center my-3">
          <Spin />
        </div>
      )}
      {!hasMore && (
        <Paragraph className="text-center my-3">
          No more images to load.
        </Paragraph>
      )}
    </>
  );
}