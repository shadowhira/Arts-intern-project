"use client"

import fetchImages from "@/lib/fetchImages";
import ImgContainer from "./ImgContainer";
import React, { useState, useEffect } from "react";
import addBlurredDataUrls from "@/lib/getBase64";
import getPrevNextPages from "@/lib/getPrevNextPages";
import Footer from "../Footer";
import Filter from "./Filter";

type Props = {
  topic?: string;
  page?: string;
};

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
};

type Album = {
  id: string;
  title: string;
};

export default function Gallery({ topic = "curated", page }: Props) {
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
      const params = new URLSearchParams();

      if (selectedAlbum) {
        url = `http://127.0.0.1:8000/albums/${selectedAlbum}/images`;
      } else if (topic && topic !== "curated") {
        params.append("title", topic);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const imagesData = await response.json();
      const publicImages = imagesData.filter((image: Image) => image.public);
      setImages(publicImages);
    }

    fetchImagesByAlbum();
  }, [selectedAlbum, topic]);

  return (
    <>
      <Filter
        albums={albums}
        selectedAlbum={selectedAlbum}
        onAlbumChange={(albumId) => setSelectedAlbum(albumId)}
      />
      <section className="px-1 my-3 grid grid-cols-gallery auto-rows-[10px]">
        {images.map((photo) => (
          <ImgContainer key={photo.id} photo={photo} />
        ))}
      </section>
    </>
  );
}
