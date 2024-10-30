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
    blurredDataUrl?: string;
  };
};

export default function ImgContainer({ photo }: Props) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.src = photo.url;
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
  }, [photo.url]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null; // Hoặc hiển thị một placeholder trong khi chờ lấy kích thước ảnh
  }

  const widthHeightRatio = dimensions.height / dimensions.width;
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
            placeholder="blur"
            blurDataURL={photo.blurredDataUrl}
            className="group-hover:opacity-75"
          />
        </div>
    </div>
  );
}