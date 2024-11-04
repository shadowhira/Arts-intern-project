// components/Search.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "../../../redux/searchSlice";
import { Form, Input } from "antd";

export default function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search) {
      dispatch(setSearchTerm(search));
      router.push("/"); // Điều hướng về trang Gallery
    }
    setSearch("");
  };

  return (
    <Form
      className="flex justify-center md:justify-between"
      onFinish={handleSubmit}
    >
      <Form.Item>
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search image"
          className="bg-white p-2 w-[260px] sm:w-80 text-xl rounded-xl text-black"
        />
      </Form.Item>
    </Form>
  );
}