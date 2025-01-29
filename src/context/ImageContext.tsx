import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface ImageData {
  file: File;
  title: string;
  width?: number;
  height?: number;
}

export interface HouseData extends ImageData {
  author: string;
  description: string;
}

export interface RoomImageData extends ImageData {
  id: number;
  file: File;
  x?: number;
  y?: number;
  z?: number;
}

interface ImageContextProps {
  houseImage: HouseData | null;
  borderImage: ImageData | null;
  roomImages: RoomImageData[];
  setHouseImage: React.Dispatch<React.SetStateAction<HouseData | null>>;
  setBorderImage: React.Dispatch<React.SetStateAction<ImageData | null>>;
  setRoomImages: React.Dispatch<React.SetStateAction<RoomImageData[]>>;
  updateRoomTitle: (index: number, newTitle: string) => void;
  updateRoomZIndex: (index: number, newZIndex: number) => void;
  updateRoomPosition: (index: number, x: number, y: number) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: "house" | "border" | "room") => void;
}

const ImageContext = createContext<ImageContextProps | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [houseImage, setHouseImage] = useState<HouseData | null>(null);
  const [borderImage, setBorderImage] = useState<ImageData | null>(null);
  const [roomImages, setRoomImages] = useState<RoomImageData[]>([]);

  const updateRoomTitle = (index: number, newTitle: string) => {
    setRoomImages((prev) => prev.map((item, i) => (i == index ? { ...item, title: newTitle } : item)));
  };

  const updateRoomPosition = (index: number, x: number, y: number) => {
    setRoomImages((prev) => prev.map((item, i) => (i === index ? { ...item, x, y } : item)));
  };

  const updateRoomZIndex = useCallback((index: number, newZIndex: number) => {
    setRoomImages((prev) => prev.map((item, i) => (i === index ? { ...item, z: newZIndex } : item)));
  }, []);

  const getImageDimensions = (file: File, index: number) => {
    return new Promise<{ index: number; width: number; height: number }>((resolve, reject) => {
      const img = new (Image as any)();
      const objectURL = URL.createObjectURL(file);

      img.onload = () => {
        const { width, height } = img;
        console.log("img onload : ", width, height);
        resolve({ index, width, height });
      };

      img.onerror = reject;
      img.src = objectURL;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    const validateDimensions = async (file: File) => {
      const dimension = await getImageDimensions(file, 0);
      return { isValid: dimension.width === 5000 && dimension.height === 5000, dimension: dimension };
    };

    if (type === "house" || type === "border") {
      try {
        const { isValid, dimension } = await validateDimensions(newFiles[0]);

        // valid 가 되는 조건 dimension.w = 5000, dimension.h=5000
        if (!isValid) {
          alert("이미지의 크기는 반드시 5000 x 5000 이어야 합니다.");
          return;
        }

        if (type === "house") {
          setHouseImage({
            file: newFiles[0],
            title: "",
            author: "",
            description: "",
            width: dimension.width,
            height: dimension.height,
          });
        } else if (type === "border") {
          setBorderImage({
            file: newFiles[0],
            title: "aoo-border-title",
            width: dimension.width,
            height: dimension.height,
          });
        }
      } catch (error) {
        console.error("Error validating dimensions:", error);
      }
    } else if (type === "room") {
      setRoomImages([]);
      const dimensionsPromises = newFiles.map((file, index) => getImageDimensions(file, index));

      try {
        const dimensions = await Promise.all(dimensionsPromises);
        const roomData = newFiles.map((file, index) => ({
          width: dimensions[index].width,
          height: dimensions[index].height,
          file,
          title: "",
          x: 0,
          y: 0,
          z: 5,
          id: index + 1,
        }));
        setRoomImages((prev) => [...prev, ...roomData]);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    }
  };

  return (
    <ImageContext.Provider
      value={{
        houseImage,
        borderImage,
        roomImages,
        setHouseImage,
        setBorderImage,
        setRoomImages,
        updateRoomTitle,
        updateRoomZIndex,
        updateRoomPosition,
        handleFileChange,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};
