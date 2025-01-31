import { memo } from "react";
import { HouseDetailInfo, Room } from "../types/house";
import API_CONFIG from "../config/api";
import { Link } from "react-router-dom";

type RenderImagesProps = {
  houseData: {
    house: HouseDetailInfo;
    rooms: Room[];
  };
  scale: number;
};

const RenderImages = memo(({ houseData, scale }: RenderImagesProps) => {
  return (
    <section className="relative w-4/5 h-full flex justify-center bg-gray-300">
      <div className="relative">
        <img
          alt="house-border-image"
          width={window.innerHeight}
          height={window.innerHeight}
          src={`${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${houseData.house.borderImageId}`}
        />

        {houseData.rooms.map((room) => (
          <Link key={room.imageId} to={`/houses/${houseData.house.houseId}/rooms/${room.roomId}`}>
            <img
              key={room.name}
              src={`${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${room.imageId}`}
              alt={room.name}
              width={Number(room.width) * scale}
              height={Number(room.height) * scale}
              style={{
                position: "absolute",
                left: Number(room.x) * scale,
                top: Number(room.y) * scale,
                zIndex: room.z,
              }}
              className=" transition-transform duration-300 ease-in-out hover:scale-105 hover:z-20 cursor-pointer"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}, arePropsEqual);

function arePropsEqual(prevProps: RenderImagesProps, nextProps: RenderImagesProps) {
  return (
    prevProps.houseData.house.borderImageId === nextProps.houseData.house.borderImageId &&
    JSON.stringify(prevProps.houseData.rooms) === JSON.stringify(nextProps.houseData.rooms) &&
    prevProps.scale === nextProps.scale
  );
}

RenderImages.displayName = "RenderImages";

export default RenderImages;
