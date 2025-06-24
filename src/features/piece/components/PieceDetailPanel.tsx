// components/PieceDetailPanel.tsx
import React, { useEffect, useState } from "react";
import SoundItem from "./SoundItem.tsx";
import Pagination from "../../../components/Pagination.tsx";

interface PieceType {
  pieceId: number;
  title: string;
  description: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  [key: string]: any; // 확장 가능
}

interface Props {
  piece: PieceType | null;
}

const PieceDetailPanel: React.FC<Props> = ({ piece }) => {
  // const [sounds, setSounds] = useState<SoundType[]>([]);
  const [pagination, setPagination] = useState<{
    size: number;
    currentPage: number;
    totalPages: number;
    totalElements: number;
  }>({
    size: 10,
    currentPage: 1,
    totalPages: 1,
    totalElements: 0,
  });

  // useEffect(() => {
  //   // TODO: 실제 API에서 가져오는 코드로 교체
  //   const data = yourFetchedPieceData;
  //   setSounds(data.sounds);
  //   setPagination(data.pagination);
  // }, []);

  const handlePageChange = (newPage: number) => {
    // TODO: 서버에서 새 페이지 가져오기
    console.log("change to page", newPage);
  };

  if (!piece) {
    return (
      <div className="">
      </div>
    );
  }

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-black/70 shadow-lg border-l z-20 pt-13 overflow-y-auto text-white">
      <div className="text-xl px-8 mb-4">
        <div className="">PERFUME</div>
        <div className="text-sm pr-10 pt-1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eget
          urna finibus...
        </div>
      </div>

      <div className="p-4">
        {dummyPieceData.sounds.map((s, i) => (
          <SoundItem
            key={s.soundId}
            index={i}
            title={s.title}
            description={s.description}
            createdTime={s.createdTime}
          />
        ))}
      </div>
      {pagination.totalPages !== 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PieceDetailPanel;


const dummyPieceData = {
  pieceId: 1,
  title: "조각",
  description: "피스는 조각입니다.",
  hidden: false,
  createdTime: 1750749753,
  updatedTime: 1750749753,
  sounds: [
    {
      soundId: 11,
      audioId: 11,
      title: "기차역",
      description: "기차가 도착하고 출발하는 생동감 있는 역 소리입니다.",
      hidden: true,
      createdTime: 1749465600,
      updatedTime: 1749465600,
    },
    {
      soundId: 10,
      audioId: 10,
      title: "명상 종소리",
      description: "마음을 가라앉히는 명상용 종소리입니다.",
      hidden: true,
      createdTime: 1749465540,
      updatedTime: 1749465540,
    },
    {
      soundId: 9,
      audioId: 9,
      title: "바람 소리",
      description: "들판을 스치는 부드러운 바람 소리입니다.",
      hidden: true,
      createdTime: 1749465480,
      updatedTime: 1749465480,
    },
    {
      soundId: 8,
      audioId: 8,
      title: "도시의 아침",
      description:
        "도시에서 아침에 들리는 자동차 소리와 사람들의 움직임입니다.",
      hidden: true,
      createdTime: 1749465420,
      updatedTime: 1749465420,
    },
    {
      soundId: 11,
      audioId: 11,
      title: "기차역",
      description: "기차가 도착하고 출발하는 생동감 있는 역 소리입니다.",
      hidden: true,
      createdTime: 1749465600,
      updatedTime: 1749465600,
    },
  ],
  pagination: {
    size: 5,
    pageNumber: 1,
    totalPages: 20,
    totalElements: 30,
  },
};