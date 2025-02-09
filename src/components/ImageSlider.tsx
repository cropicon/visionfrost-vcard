import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useVCardStore } from '../store/useVCardStore';
import { Plus, X } from 'lucide-react';
import { Button } from './ui/Button';

export const ImageSlider: React.FC<{ isPreviewMode?: boolean }> = ({ isPreviewMode }) => {
  const { data, addImage, removeImage } = useVCardStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = React.useState<{ [key: string]: boolean }>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload only image files.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          addImage(reader.result);
        }
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = (imageUrl: string) => {
    setImageError(prev => ({ ...prev, [imageUrl]: true }));
  };

  if (data.images.length === 0 && isPreviewMode) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Image Gallery</h3>
        {!isPreviewMode && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          capture="environment"
        />
      </div>
      
      {data.images.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={!isPreviewMode}
          pagination={{ clickable: true }}
          className="rounded-lg overflow-hidden"
          style={{ width: '100%', height: 'auto' }}
        >
          {data.images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full pb-[56.25%]">
                {!imageError[image] ? (
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="absolute top-0 left-0 w-full h-full object-contain bg-gray-100 dark:bg-gray-800"
                    onError={() => handleImageError(image)}
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <span className="text-gray-500">Image not available</span>
                  </div>
                )}
                {!isPreviewMode && (
                  <button
                    onClick={() => removeImage(image)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : !isPreviewMode && (
        <div className="text-center py-8 bg-gray-100 rounded-lg dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">No images added yet</p>
        </div>
      )}
    </div>
  );
};