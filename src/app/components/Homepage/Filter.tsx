// components/Filter.tsx
import React from "react";
import { Button } from "antd";

type Album = {
  id: string;
  title: string;
};

type FilterProps = {
  albums: Album[];
  selectedAlbum: string;
  onAlbumChange: (albumId: string) => void;
};

export default function Filter({
  albums,
  selectedAlbum,
  onAlbumChange,
}: FilterProps) {
  const allAlbums = [{ id: "", title: "All" }, ...albums];

  return (
    <div className="flex space-x-4 p-4">
      {allAlbums.map((album) => (
        <Button
          key={album.id}
          onClick={() => onAlbumChange(album.id)}
          type={selectedAlbum === album.id ? "primary" : "default"}
        >
          {album.title}
        </Button>
      ))}
    </div>
  );
}