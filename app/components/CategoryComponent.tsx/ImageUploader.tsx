// components/ImageUploader.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  onImageRemove: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  onImageChange,
  onImageRemove,
}) => {
  const [localImage, setLocalImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLocalImage(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImageChange(e.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      {imageUrl || localImage ? (
        <div className="relative">
          <Image
            src={localImage || imageUrl}
            alt="Preview"
            width={128}
            height={128}
            className="h-32 w-32 object-cover object-top rounded-md"
          />
          <button
            type="button"
            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
            onClick={() => {
              onImageRemove();
              setLocalImage(null);
            }}
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      ) : (
        <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-500">
          <i className="fas fa-cloud-upload-alt text-2xl"></i>
        </div>
      )}
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Paste image URL"
          className="block border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={imageUrl}
          onChange={handleUrlChange}
        />
        <input
          type="file"
          accept="image/*"
          className="block border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImageUploader;