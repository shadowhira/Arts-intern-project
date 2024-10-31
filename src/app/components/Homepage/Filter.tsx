// components/Filter.tsx
import React from "react";

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
  return (
    <div className="flex space-x-4 p-4">
      <button
        onClick={() => onAlbumChange("")}
        className={`px-4 py-2 text-sm rounded ${
          selectedAlbum === "" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        All
      </button>

      {albums.map((album) => (
        <button
          key={album.id}
          onClick={() => onAlbumChange(album.id)}
          className={`px-4 py-2 text-sm rounded ${
            selectedAlbum === album.id
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          {album.title}
        </button>
      ))}
    </div>
  );
}
