import { useState, useEffect } from "react";
import WaveformWithAudioLight from "../../../Sound/AudioLight";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { TbShieldLock } from "react-icons/tb";
import { UniverseCategory } from "../../../../constants/universeData";
import { FiSearch } from "react-icons/fi";
import UserSearch from "../UserSearch";
import Modal from "../../../modal/Modal";

interface DetailInfoStepProps {
  innerImg: File | null;
  thumbMusic: File | null;
  thumbnail: File | null;
  onChange: (data: {
    title: string;
    description: string;
    authorId: number;
    category: string;
    publicStatus: string;
    tags: string[];
  }) => void;
}

enum PublicStatusOption {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export default function DetailInfoStep({
  innerImg,
  thumbMusic,
  thumbnail,
  onChange,
}: DetailInfoStepProps) {
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  // 입력 상태
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publicStatus, setPublicStatus] = useState<PublicStatusOption>(
    PublicStatusOption.PUBLIC
  );
  const [tags, setTags] = useState<string>("");
  const [category, setCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 모달 내에서 회원 선택하면 호출할 함수 (예시)
  const handleAuthorSelect = (authorName: string) => {
    setSelectedAuthor(authorName);
    closeModal();
  };

  // 태그 상태 (배열로 관리)
  const [tagList, setTagList] = useState<string[]>([]);

  useEffect(() => {
    if (innerImg) {
      const url = URL.createObjectURL(innerImg);
      setPreviewInnerImg(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewInnerImg(null);
    }
  }, [innerImg]);

  useEffect(() => {
    if (thumbMusic) {
      console.log(thumbMusic);

      const url = URL.createObjectURL(thumbMusic);
      setPreviewMusic(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewMusic(null);
    }
  }, [thumbMusic]);

  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setPreviewThumbnail(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewThumbnail(null);
    }
  }, [thumbnail]);

  // 태그 입력 처리: 스페이스 입력 시 자동 # 붙이기
  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // 스페이스바 입력 시 자동으로 # 붙이기
    if (val.endsWith(" ")) {
      val = val.trimEnd();
      if (val.length === 0) {
        val = "#";
      } else {
        // 태그가 #로 시작하지 않는 단어가 있다면 붙이기
        const parts = val.split(" ");
        val = parts
          .map((part) => (part.startsWith("#") ? part : `#${part}`))
          .join(" ");
        val += " ";
      }
    }
    setTags(val);

    // 태그 리스트로 업데이트 (#만 있는 태그 제외)
    const arr = val
      .split(" ")
      .map((t) => t.trim())
      .filter((t) => t.startsWith("#") && t.length > 1);
    setTagList(arr);
  };

  // 상위 컴포넌트로 데이터 전달
  useEffect(() => {
    var authorId = 2;
    onChange({
      title,
      description,
      authorId,
      category,
      publicStatus,
      tags: tagList,
    });
  }, [title, description, category, publicStatus, tagList]);

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <div className="flex flex-row my-auto justify-between">
        <div className="text-xl font-semibold mb-5">세부정보 작성</div>
        {/* 공개여부 설정 */}
        <div className="flex space-x-5 items-end mb-1.5">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="publicStatus"
              checked={publicStatus === PublicStatusOption.PUBLIC}
              onChange={() => setPublicStatus(PublicStatusOption.PUBLIC)}
              className="hidden"
            />
            <span className="h-5 w-5 border border-neutral-500 rounded-full flex items-center justify-center">
              {publicStatus === PublicStatusOption.PUBLIC && (
                <span className="h-3 w-3 bg-neutral-400 rounded-full"></span>
              )}
            </span>
            <span className="flex items-center gap-1 text-neutral-600">
              <HiGlobeAsiaAustralia
                className="text-neutral-500 mb-0.5"
                size={17}
              />
              공개
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="publicStatus"
              checked={publicStatus === PublicStatusOption.PRIVATE}
              onChange={() => setPublicStatus(PublicStatusOption.PRIVATE)}
              className="hidden"
            />
            <span className="h-5 w-5 border border-neutral-500 rounded-full flex items-center justify-center">
              {publicStatus === PublicStatusOption.PRIVATE && (
                <span className="h-3 w-3 bg-neutral-400 rounded-full"></span>
              )}
            </span>
            <span className="flex items-center gap-1 text-neutral-600">
              <TbShieldLock className="text-neutral-500 mb-0.5" size={17} />
              비공개
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-full lg:h-[500px] gap-4">
        {/* 좌측 영역 */}
        <div className="flex flex-col flex-shrink-0 gap-3 w-full lg:w-[500px]">
          {/* 내부 이미지 미리보기 */}
          <div className="min-w-[300px] min-h-[300px] flex items-center justify-center border border-gray-300 rounded-xl bg-transparent p-5">
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
          <div className="min-w-[490px] min-h-[150px] flex items-center justify-center border border-gray-300 rounded-xl bg-transparent p-1">
            {previewMusic && (
              <WaveformWithAudioLight
                audioUrl={previewMusic}
                audioTitle={thumbMusic?.name || "썸네일 음악 미리듣기"}
              />
            )}
          </div>
        </div>

        {/* 우측 영역 */}
        <div className="flex flex-col flex-1 gap-3 min-w-[450px]">
          {/* 제목 */}
          <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[60px]">
            <label className="text-neutral-500 mb-0.5">제목</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="outline-none bg-transparent w-full text-gray-900 pr-13"
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
              className="outline-none bg-transparent w-full h-full text-gray-900 mb-5"
              maxLength={500}
              placeholder="설명을 입력하세요"
            />
            <div className="absolute bottom-2 right-4 text-xs text-gray-500">
              {description.length} / 500
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

          <div className="flex flex-row gap-3">
            {/* 카테고리 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[60px]">
              <label className="text-neutral-500 mb-0.5">카테고리</label>
              <select
                value={category}
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

            {/* 작성자 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 min-h-[60px]">
              <label className="text-neutral-500 mb-1">작성자</label>
              <div
                className="relative w-full"
                // 텍스트박스, 아이콘 영역 클릭 시 모달 열기
                onClick={openModal}
              >
                <input
                  type="text"
                  value={selectedAuthor}
                  readOnly
                  placeholder="작성자를 검색해서 선택하세요"
                  className="w-full pr-10 cursor-pointer bg-transparent outline-none text-gray-900"
                />
                <FiSearch
                  size={20}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={openModal} // 아이콘도 클릭 가능하게
                />
              </div>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                        <Modal onClose={closeModal} bgColor="white">
                <UserSearch
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  onSelect={handleAuthorSelect}
                />
                      </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
