import fetchImages from "@/lib/fetchImages";
import ImgContainer from "./ImgContainer";
import React from "react";
import addBlurredDataUrls from "@/lib/getBase64";
import getPrevNextPages from "@/lib/getPrevNextPages";
import Footer from "../Footer";
import Filter from "./Filter";
import { useState, useEffect } from "react";

type Props = {
  topic?: string | undefined;
  page?: string | undefined;
};


export default async function Gallery({ topic = "curated", page }: Props) {
  const url = "http://127.0.0.1:8000/images";

  const response = await fetch(url);
  const images = await response.json();

  if (!images || images.length === 0)
    return <h2 className="m-4 text-2xl font-bold">No Images Found</h2>;

  // Lọc các ảnh có thuộc tính public là true
  const publicImages = images.filter((image: any) => image.public);

  const photosWithBlur = await addBlurredDataUrls(publicImages);

  // calculate pagination
  const { prevPage, nextPage } = getPrevNextPages(publicImages);
  const footerProps = { topic, page, nextPage, prevPage };

  return (
    <>
      <Filter />
      <section className="px-1 my-3 grid grid-cols-gallery auto-rows-[10px]">
        {publicImages.map((photo: any) => (
          <ImgContainer key={photo.id} photo={photo} />
        ))}
      </section>
      <Footer {...footerProps} />
    </>
  );
}