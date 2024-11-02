"use client";

import ImgContainer from "./ImgContainer";
import React, { useState, useEffect } from "react";
import Filter from "./Filter";

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

  useEffect(() => {
    // Fetch albums to use for filtering
    async function fetchAlbums() {
      const response = await fetch("http://127.0.0.1:8000/albums");
      const albumsData = await response.json();
      setAlbums(albumsData);
    }

    fetchAlbums();
  }, []);

  useEffect(() => {
    async function fetchImagesByAlbum() {
      let url = "http://127.0.0.1:8000/images";

      if (selectedAlbum) {
        url = `http://127.0.0.1:8000/albums/${selectedAlbum}/images`;
      }

      const response = await fetch(`${url}?publicOnly=true`);
      const publicImages = await response.json();
      setImages(publicImages);
    }

    fetchImagesByAlbum();
  }, [selectedAlbum]);

  return (
    <>
      <Filter
        albums={albums}
        selectedAlbum={selectedAlbum}
        onAlbumChange={(albumId) => setSelectedAlbum(albumId)}
      />
      <section className="px-1 my-3 grid grid-cols-gallery auto-rows-[10px]">
        {images.map((photo) => (
          <ImgContainer key={photo.id} {...photo} />
        ))}
      </section>
    </>
  );
}