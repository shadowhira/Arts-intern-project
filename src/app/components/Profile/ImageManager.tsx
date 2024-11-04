import { useEffect, useState } from "react";
import { Upload, Button, Modal, Form, Input, Select, Switch, message } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { getAccessToken } from '../../../lib/auth';
import UploadComponent from '../NavBar/Upload'; // Import UploadComponent

interface ImageManagerProps {
  userId: number;
}

interface Image {
  id: string;
  url: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ImageManager({ userId }: ImageManagerProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false); // State for upload modal
  const [editingImage, setEditingImage] = useState<Image | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      const accessToken = await getAccessToken();
      const response = await fetch(`http://127.0.0.1:8000/albums?userId=${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setAlbums(data);
    };

    fetchAlbums();
  }, [userId]);

  useEffect(() => {
    const fetchImages = async () => {
      const accessToken = await getAccessToken();
      let url = `http://127.0.0.1:8000/images?userId=${userId}`;
      if (selectedAlbum) {
        url += `&albumId=${selectedAlbum}`;
      }
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setImages(data);
    };

    fetchImages();
  }, [userId, selectedAlbum]);

  const handleEditImage = async (values: any) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`http://127.0.0.1:8000/images/${editingImage?.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const updatedImage = await response.json();
      setImages(images.map(img => img.id === updatedImage.id ? updatedImage : img));
      message.success("Ảnh đã được cập nhật.");
      setIsEditModalVisible(false);
    } else {
      message.error("Cập nhật ảnh thất bại.");
    }
  };

  const handleDeleteImage = async (id: string) => {
    const accessToken = await getAccessToken();
    const response = await fetch(`http://127.0.0.1:8000/images/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      setImages(images.filter(img => img.id !== id));
      message.success("Ảnh đã được xóa.");
    } else {
      message.error("Xóa ảnh thất bại.");
    }
  };

  const handleUploadSuccess = (newImage: Image) => {
    setImages([...images, newImage]);
    setIsUploadModalVisible(false);
  };

  return (
    <div>
      <h3>Quản lý ảnh</h3>
      <Select
        placeholder="Chọn album"
        style={{ width: 200, marginBottom: 16 }}
        onChange={value => setSelectedAlbum(value)}
        allowClear
      >
        {albums.map(album => (
          <Select.Option key={album.id} value={album.id}>
            {album.title}
          </Select.Option>
        ))}
      </Select>
      <Button icon={<UploadOutlined />} onClick={() => setIsUploadModalVisible(true)}>
        Upload
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {images.map(image => {
          if (image.status === 'rejected') {
            return null;
          }

          const imageClass = image.status === 'pending' ? 'opacity-50' : '';

          return (
            <div key={image.id} className={`relative group border rounded overflow-hidden ${imageClass}`}>
              <img src={image.url} alt={image.title} className="w-full h-48 object-cover" />
              {image.status === 'pending' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                  Pending Approval
                </div>
              )}
              <div className="absolute top-0 right-0 m-2">
                <Button className="mr-2" onClick={() => { setEditingImage(image); setIsEditModalVisible(true); }}>Edit</Button>
                <Button danger onClick={() => handleDeleteImage(image.id)}>Delete</Button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        title="Edit Image"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form initialValues={editingImage || {}} onFinish={handleEditImage}>
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="public" label="Public" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Upload Image"
        open={isUploadModalVisible}
        onCancel={() => setIsUploadModalVisible(false)}
        footer={null}
      >
        <UploadComponent
          albums={albums}
          currentUserId={userId.toString()}
          setAlbums={setAlbums}
          onUploadSuccess={handleUploadSuccess} // Truyền hàm callback vào UploadComponent
        />
      </Modal>
    </div>
  );
}