import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { TbShieldLock } from "react-icons/tb";
import PageLayout from "../../components/layout/PageLayout";
import { UniverseCategory } from "../../constants/universeData";
import API_CONFIG from "../../config/api";
import WaveformWithAudioLightRow from "../../components/Sound/WaveformWithAudioLightRow";
import { PublicStatusOption, Universe } from "../../types/universe";
import UniverseEditInnerImg from "../../components/pageComponent/universe/UniverseEditInnerImg";

export default function UniverseEditPage() {
  const { universeId } = useParams(); // id는 문자열로 들어옴
  const universeIdParsed = parseInt(universeId || "", 10); // 숫자로 변환

  const [universe, setUniverse] = useState<Universe>();
  // 내부 이미지 미리보기
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);

  // 음악 미리듣기
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);
  const [thumbMusic, setThumbMusic] = useState<File | null>(null); // 또는 해당 음악의 이름 등

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isPublic, setIsPublic] = useState(true); // 기본값: 공개
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);

  const fetchUniverse = async () => {
    const response = await fetch(
      `${API_CONFIG.BACK_API}/universes/${universeId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch universe: ${response.statusText}`);
    }

    const universeData: Universe = await response.json();
    setUniverse(universeData);
  };

  useEffect(() => {
    console.log(universeIdParsed);

    if (!isNaN(universeIdParsed)) {
      fetchUniverse();
    }
  }, [universeIdParsed]);

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTags(input);

    if (input.endsWith(" ")) {
      const newTag = input.trim();
      if (newTag && !tagList.includes(newTag) && tagList.length < 10) {
        setTagList([...tagList, newTag]);
      }
      setTags(""); // 입력창 초기화
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
              <UniverseEditInnerImg universe={universe} onEdit={() => {}} />
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
                  audioTitle={thumbMusic == null ? "" : thumbMusic?.name}
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
                onChange={(e) => setTitle(e.target.value)}
                className="outline-none bg-transparent w-full text-gray-900"
                maxLength={100}
                placeholder="제목을 입력하세요"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {title.length} / 100
              </div>
            </div>

            {/* 설명 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px] flex-grow">
              <label className="text-neutral-500 mb-0.5">설명</label>
              <textarea
                value={universe?.description}
                onChange={(e) => setDescription(e.target.value)}
                className="outline-none bg-transparent w-full h-full text-gray-900 mb-5"
                maxLength={500}
                placeholder="설명을 입력하세요"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {description.length} / 500
              </div>
            </div>

            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px]">
              <label className="text-neutral-500 mb-0.5">카테고리</label>
              <select
                value={universe?.category}
                onChange={(e) => setCategory(e.target.value)}
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
                    {isPublic && (
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
                    {!isPublic && (
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

            {/* 태그 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[80px]">
              <label className="text-neutral-500 mb-0.5">태그</label>
              <input
                value={tags}
                onChange={handleTagInput}
                placeholder="#태그를 입력하고 스페이스바로 구분"
                className="outline-none bg-transparent w-full text-gray-900"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {tagList.length} / 10
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
