"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  photo: {
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
};

export default function ImgContainer({ photo }: Props) {
  const { width, height } = photo;

  if (!width || !height) {
    return null; // Or display a placeholder while waiting for image dimensions
  }

  const widthHeightRatio = height / width;
  const galleryHeight = Math.ceil(250 * widthHeightRatio);
  const photoSpans = Math.ceil(galleryHeight / 10) + 1; // 10 pixel per row

  return (
    <div
      className="w-[250px] justify-self-center"
      style={{ gridRow: `span ${photoSpans}` }}
    >
      <div className="rounded-xl overflow-hidden group">
        <Image
          src={photo.url}
          alt={photo.title}
          width={250}
          height={galleryHeight}
          sizes="250px"
          // placeholder="blur"
          // blurDataURL={photo.blurredDataUrl}
          className="group-hover:opacity-75"
        />
      </div>
    </div>
  );
}