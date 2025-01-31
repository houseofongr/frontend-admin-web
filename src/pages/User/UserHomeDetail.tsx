import { useEffect, useState } from "react";
import { HouseData } from "../House/HouseDetail";
import { useParams } from "react-router-dom";
import API_CONFIG from "../../config/api";
import CardLabel from "../../components/label/CardLabel";
import { formatDate } from "../../utils/formatDate";
import { Link } from "react-router-dom";
import SpinnerIcon from "../../components/icons/SpinnerIcon";

type BaseInfo = {
  homeId: number;
  homeName: string;
  createdDate: string;
  updatedDate: string;
};

export default function UserHomeDetail() {
  const params = useParams<{ homeId?: string }>();

  const [scale, setScale] = useState<number | null>(null);
  const [homeData, setHomeData] = useState<HouseData | null>(null);
  const [info, setInfo] = useState<BaseInfo | null>(null);
  const [houseTempleteId, setHouseTempleteId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!params.homeId) return;
    const fetchUserHomeData = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BACK_API}/homes/${params.homeId}`);
        const { homeId, homeName, createdDate, updatedDate, house, rooms } = await response.json();

        setInfo({ homeId, homeName, createdDate, updatedDate });
        setHomeData({ house, rooms });

        // 화면 높이를 기준으로 스케일 설정
        setScale(window.innerHeight / 5000);
      } catch (error) {
        console.error("Failed to fetch user homes:", error);
      }
    };

    fetchUserHomeData();
    localStorage.setItem("userHomeId", JSON.stringify(params.homeId));

    const storedHouseTemplateId = localStorage.getItem("houseId");
    if (storedHouseTemplateId) {
      setHouseTempleteId(Number(storedHouseTemplateId));
    }

    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(JSON.parse(storedUserId)));
    }
  }, [params.homeId]);

  useEffect(() => {
    if (homeData) {
      localStorage.setItem("roomImagesId", JSON.stringify(homeData?.rooms?.map((room) => room.imageId) || []));
    }
  }, [homeData]);

  if (!homeData || !info || !scale) {
    return (
      <div className="w-full h-full flex-center">
        <SpinnerIcon />
      </div>
    );
  }

  if (homeData && scale) {
    return (
      <div className="w-full h-full flex items-center">
        <section className="w-1/5 h-full flex flex-col overflow-scroll py-10 px-5">
          <div className="flex gap-1 flex-col">
            <CardLabel text={`HOUSE TEMPLATE ID#${houseTempleteId}`} size="large" />
            <CardLabel text={`HOME ID#${info.homeId}`} size="large" />
            <CardLabel text={`USER ID#${userId}`} size="large" />
          </div>
          <h1 className="text-lg font-extrabold pt-4">{info.homeName}</h1>
          <p className="text-sm  text-gray-400">
            생성일 {formatDate(info.updatedDate)} / 수정일 {formatDate(info.updatedDate)}
          </p>
        </section>

        <section className="relative w-4/5 h-full flex justify-center bg-gray-300">
          <div className="relative">
            <img
              alt="user-home-border-image"
              width={window.innerHeight}
              height={window.innerHeight}
              src={`${API_CONFIG.PRIVATE_IMAGE_LOAD_API}/${homeData.house.borderImageId}`}
            />
            {homeData.rooms.map((room) => (
              <Link key={room.imageId} to={`/users/${userId}/${info.homeId}/${room.roomId}`}>
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
                  className="transition-transform duration-300 ease-in-out hover:scale-105 hover:z-20 cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }
}
