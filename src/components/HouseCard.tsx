import CardLabel from "./label/CardLabel";
import { House } from "../types/house";
import API_CONFIG from "../config/api";
import { FaRegPenToSquare } from "react-icons/fa6";

type HouseProps = {
  house: House;
};

export default function HouseCard({ house }: HouseProps) {
  return (
    <>
      <div className="w-1/2 p-2  flex flex-col justify-between">
        <div>
          <CardLabel text={`AOO HOUSE NO.${house.id}`} hasBorder={false} hasPadding={false} />

          <div className="py-2">
            <p className="text-[13px] md:text-base text-ellipsis line-clamp-2">{house.title}</p>
            <p className="font-thin text-sm text-stone-500">Designed by {house.author}</p>
          </div>

          <p className="text-[13px] font-light md:text-[15px] mb-2 line-clamp-2">{house.description}</p>
        </div>

        <div className="text-[12px] font-light text-stone-600">
          <div className="flex gap-1 items-center">
            <div>
              <FaRegPenToSquare size={12} />
            </div>
            <span>CREATED / UPDATED</span>{" "}
          </div>
          <div className="text-xs md:text-[14px] ">{house.createdDate + ` / ` + house.updatedDate}</div>
        </div>
      </div>
      <div className="w-1/2 flex justify-center items-center pl-4">
        <img
          src={`${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${house.imageId}`}
          alt={`${house.title}`}
          width={200}
          height={200}
        />
      </div>
    </>
  );
}
