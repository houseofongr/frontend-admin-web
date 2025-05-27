import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WaveformWithAudioLight from "../../components/Sound/AudioLight";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { TbShieldLock } from "react-icons/tb";
import PageLayout from "../../components/layout/PageLayout";

export default function UniverseEditPage() {
  const { id } = useParams(); // id는 문자열로 들어옴
  const universeId = parseInt(id || "", 10); // 숫자로 변환

  // 내부 이미지 미리보기
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);

  // 음악 미리듣기
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);
  const [thumbMusic, setThumbMusic] = useState<File | null>(null); // 또는 해당 음악의 이름 등

  // 제목, 설명
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 공개 여부
  const [isPublic, setIsPublic] = useState(true); // 기본값: 공개

  // 태그 관련
  const [tags, setTags] = useState("");
  const [tagList, setTagList] = useState<string[]>([]);

  useEffect(() => {
    if (!isNaN(universeId)) {
      // fetch나 상태에서 universeId를 기반으로 데이터 불러오기
      console.log("편집할 ID:", universeId);
    }
  }, [universeId]);

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
      <div className="flex flex-1 flex-col lg:flex-row gap-4 p-3 lg:w-[80%] w-[90%]">
        {/* 좌측 영역 */}
        <div className="flex flex-2 flex-col flex-shrink-0 gap-3">
          {/* 내부 이미지 미리보기 */}
          <div className=" flex flex-2 items-center justify-center border border-gray-300 rounded-xl bg-transparent p-5">
            {previewInnerImg ? (
              <img
                src={previewInnerImg}
                alt="내부 이미지 미리보기"
                className="object-contain max-h-full max-w-full"
              />
            ) : (
              "내부이미지"
            )}
          </div>

          {/* 썸뮤직 미리듣기 */}
          <div className="min-w-[490px] min-h-[150px] flex-1 flex items-center justify-center border border-gray-300 rounded-xl bg-transparent p-1">
            {previewMusic && (
              <WaveformWithAudioLight
                audioUrl={previewMusic}
                audioTitle={thumbMusic?.name || "썸네일 음악 미리듣기"}
              />
            )}
          </div>
        </div>

        {/* 우측 영역 */}
        <div className="flex flex-col flex-1 gap-3 min-w-[300px]">
          {/* 제목 */}
          <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[60px]">
            <label className="text-neutral-500 mb-0.5">제목</label>
            <input
              value={title}
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
          <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[60px] flex-grow">
            <label className="text-neutral-500 mb-0.5">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="outline-none bg-transparent w-full h-full text-gray-900"
              maxLength={500}
              placeholder="설명을 입력하세요"
            />
            <div className="absolute bottom-2 right-4 text-xs text-gray-500">
              {description.length} / 500
            </div>
          </div>

          {/* 공개여부 */}
          <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[60px]">
            <label className="text-neutral-500 mb-0.5">공개여부</label>
            <div className="flex space-x-10 justify-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="isPublic"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
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
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
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
          <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[60px]">
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
    </PageLayout>
  );
}
