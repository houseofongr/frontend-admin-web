import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { TbShieldLock } from "react-icons/tb";
import PageLayout from "../../components/layout/PageLayout";
import { PublicStatusOption, UniverseCategory } from "../../constants/universeData";
import API_CONFIG from "../../config/api";
import WaveformWithAudioLightRow from "../../components/Sound/WaveformWithAudioLightRow";
import { Universe } from "../../types/universe";
import UniverseEditInnerImg from "../../components/pageComponent/universe/UniverseEditInnerImg";

export default function UniverseEditPage() {
  const { universeId } = useParams(); // id는 문자열로 들어옴
  const universeIdParsed = parseInt(universeId || "", 10); // 숫자로 변환

  const [universe, setUniverse] = useState<Universe>({
    id: 0,
    thumbnailId: 0,
    thumbMusicId: 0,
    createdTime: Date.now(),
    updatedTime: Date.now(),
    view: 0,
    like: 0,
    title: "",
    description: "",
    author: "",
    category: "",
    publicStatus: "PRIVATE", // 또는 "PUBLIC"
    tags: [],
  });

  const fetchUniverse = async () => {
    const response = await fetch(
      `${API_CONFIG.BACK_API}/universes/${universeId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch universe: ${response.statusText}`);
    }

    const universeData: Universe = await response.json();
    setUniverse(universeData);
    console.log(universe);
    
  };

  useEffect(() => {
    console.log(universeIdParsed);

    if (!isNaN(universeIdParsed)) {
      fetchUniverse();
    }
  }, [universeIdParsed]);




  // 태그 입력 상태 (문자열)
  const [tags, setTags] = useState("");

  // universe 상태 (이미 선언됐다고 가정)

  const normalizeTagsAndUpdateState = (raw: string) => {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    const normalized = parts.map((part) =>
      part.startsWith("#") ? part : `#${part}`
    );
    const result = normalized.join(" ") + (raw.endsWith(" ") ? " " : "");
    const validTags = normalized
      .filter((t) => t.length > 1)
      .map((t) => t.replace(/^#/, ""));

    // 우선 tags 상태도 같이 업데이트 (input 값 유지용)
    setTags(result);

    setUniverse((prev) => ({
      ...prev!,
      tags: validTags,
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(" ")) {
      normalizeTagsAndUpdateState(val);
    } else {
      setTags(val);
    }
  };

  return (
    <PageLayout>
      <section className="w-full mx-8 py-20 md:py-10 p-3 lg:w-[80%]">
        <div className="px-3 flex flex-row">
          <h1 className="font-bold text-base lg:text-lg">유니버스 상세 정보</h1>
          <button>버튼</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 p-3 w-[100%]">
          {/* 좌측 영역 */}
          <div className="flex flex-2 flex-col gap-3 h-[100%]">
            {universe && universe.thumbnailId != null && (
              <UniverseEditInnerImg universe={universe} onEdit={() => { }} />
            )}

            {/* 내부 이미지 미리보기 */}
            {/* <div className="relative flex grow items-center justify-center border border-gray-300 rounded-xl bg-transparent p-5">
              <img
                src={`${API_CONFIG.PUBLIC_IMAGE_LOAD_API}/${
                  universe!.thumbnailId
                }`}
                alt=""
                className="object-contain"
              />
            </div> */}
            <div className="h-[30%] flex-col">
              {/* 썸뮤직 미리듣기 */}
              {universe && universe.thumbMusicId != null && (
                <WaveformWithAudioLightRow
                  audioUrl={`${API_CONFIG.VITE_AUDIO_LOAD_PUBLIC}/${universe?.thumbMusicId}`}
                  audioTitle={universe.thumbMusicId == null ? "" : ""}
                />
              )}
            </div>
          </div>
          {/* 우측 영역 */}
          <div className="flex flex-1 flex-col gap-3 min-w-[300px] ">
            {/* 제목 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px]">
              <label className="text-neutral-500 mb-0.5">제목</label>
              <input
                value={universe?.title}
                onChange={(e) => setUniverse((prev) => ({
                  ...prev!,
                  title: e.target.value
                }))}
                className="outline-none bg-transparent w-full text-gray-900"
                maxLength={100}
                placeholder="제목을 입력하세요"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {universe?.title.length} / 100
              </div>
            </div>

            {/* 설명 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px] flex-grow">
              <label className="text-neutral-500 mb-0.5">설명</label>
              <textarea
                value={universe?.description}
                onChange={(e) => setUniverse((prev) => ({
                  ...prev!,
                  description: e.target.value
                }))}
                className="outline-none bg-transparent w-full h-full text-gray-900 mb-5"
                maxLength={500}
                placeholder="설명을 입력하세요"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {universe?.description!.length} / 500
              </div>
            </div>

            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px]">
              <label className="text-neutral-500 mb-0.5">카테고리</label>
              <select
                value={universe?.category}
                onChange={(e) => setUniverse((prev) => ({
                  ...prev!,
                  category: e.target.value
                }))}
                className="outline-none bg-transparent w-full text-gray-900"
              >
                <option value="" disabled>
                  카테고리를 선택하세요
                </option>
                {Object.entries(UniverseCategory).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 공개여부 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px]">
              <label className="text-neutral-500 mb-0.5">공개여부</label>
              <div className="flex space-x-10 justify-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPublic"
                    checked={
                      universe?.publicStatus == PublicStatusOption.PUBLIC
                    }
                    onChange={() =>
                      setUniverse((prev) => ({
                        ...prev!,
                        publicStatus: PublicStatusOption.PUBLIC,
                      }))
                    }
                    className="hidden"
                  />
                  <span className="h-5 w-5 border border-neutral-500 rounded-full flex items-center justify-center">
                    {universe?.publicStatus == PublicStatusOption.PUBLIC && (
                      <span className="h-3 w-3 bg-neutral-400 rounded-full"></span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 text-neutral-600">
                    <HiGlobeAsiaAustralia
                      className="text-neutral-500"
                      size={20}
                    />
                    공개
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isPublic"
                    checked={
                      universe?.publicStatus == PublicStatusOption.PUBLIC
                    }
                    onChange={() =>
                      setUniverse((prev) => ({
                        ...prev!,
                        publicStatus: PublicStatusOption.PRIVATE,
                      }))
                    }
                    className="hidden"
                  />
                  <span className="h-5 w-5 border border-neutral-500 rounded-full flex items-center justify-center">
                    {universe?.publicStatus == PublicStatusOption.PRIVATE && (
                      <span className="h-3 w-3 bg-neutral-400 rounded-full"></span>
                    )}
                  </span>
                  <span className="flex items-center gap-2 text-neutral-600">
                    <TbShieldLock className="text-neutral-500" size={20} />
                    비공개
                  </span>
                </label>
              </div>
            </div>

            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px]">
              <label className="text-neutral-500 mb-0.5">태그</label>
              <input
                value={tags}
                onChange={handleTagChange}
                onBlur={() => normalizeTagsAndUpdateState(tags)} 
                placeholder="#태그를 입력하고 스페이스바로 구분"
                className="outline-none bg-transparent w-full text-gray-900"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {universe.tags?.length || 0} / 10
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
