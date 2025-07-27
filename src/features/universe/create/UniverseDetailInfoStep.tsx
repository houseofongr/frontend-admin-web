import { useState, useEffect } from "react";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { TbShieldLock } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import UserSearch from "../../universe/create/UserSearch";
import Modal from "../../../components/modal/Modal";
import { UserV2 } from "../../../types/user";
import { Category } from "../../../types/universe";
import { PublicStatusOption } from "../../../constants/PublicStatusOption";
import { InputField } from "../../../components/Input/InputField";
import { TextareaField } from "../../../components/Input/TextareaField";
import { CategorySelectField } from "../../../components/Input/SelectField";
import { AuthorSelectField } from "../../../components/Input/AuthorSelectField";
import { SelectableRadioField } from "../../../components/Input/SelectableRadioField";
import { useUniverseStore } from "../../../context/useUniverseStore";
import { useCategories } from "../../../context/useCategoryStore";
import AudioWaveform from "../../../components/Sound/V2/AudioWaveform";

interface DetailInfoStepProps {
  innerImg: File | null;
  thumbMusic: File | null;
  detailInfo: {
    title: string;
    description: string;
    authorId: UserV2 | null;
    category: Category | null;
    publicStatus: string;
    hashtags: string[];
  };
  onChange: (data: {
    title: string;
    description: string;
    authorId: UserV2;
    category: Category;
    publicStatus: string;
    hashtags: string[];
  }) => void;
}

export default function UniverseDetailInfoStep({
  innerImg,
  thumbMusic,
  detailInfo,
  onChange,
}: DetailInfoStepProps) {
  const categories = useCategories(); // 자동 로딩됨
  // 미리보기
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);
  const [previewMusic, setPreviewMusic] = useState<string | null>(null);

  // 입력값 상태
  const [title, setTitle] = useState(detailInfo.title);
  const [description, setDescription] = useState(detailInfo.description);
  const [publicStatus, setPublicStatus] = useState<PublicStatusOption>(
    detailInfo.publicStatus == PublicStatusOption.PUBLIC
      ? PublicStatusOption.PUBLIC
      : PublicStatusOption.PRIVATE
  );
  const [tags, setTags] = useState<string>(detailInfo.hashtags.join(" "));
  const [tagList, setTagList] = useState<string[]>([]);
  const [category, setCategory] = useState<Category | null>(
    detailInfo.category
  );
  const [authorId, setAuthorId] = useState<UserV2 | null>(detailInfo.authorId);

  // 작성자 선택 모달
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAuthorSelect = (user: UserV2) => {
    setAuthorId(user);
    closeModal();
  };

  // 태그 입력 처리
  const normalizeTagsAndUpdateState = (raw: string) => {
    // 스페이스 기준 분리, 공백 제거
    const parts = raw.trim().split(/\s+/).filter(Boolean);

    // 각 파트에 # 붙이기
    const normalized = parts.map((part) =>
      part.startsWith("#") ? part : `#${part}`
    );

    // 다시 문자열로, 원래 공백 유지
    const result = normalized.join(" ") + (raw.endsWith(" ") ? " " : "");

    // 상태 저장
    setTags(result);

    // 태그 리스트 저장 (# 제거)
    const validTags = normalized
      .filter((t) => t.length > 1)
      .map((t) => t.replace(/^#/, ""));
    setTagList(validTags);
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // 스페이스 포함됐을 때만 정리 실행
    if (val.endsWith(" ")) {
      normalizeTagsAndUpdateState(val);
    } else {
      setTags(val); // 그냥 입력 중 상태 반영
    }
  };

  const handleTagBlur = () => {
    normalizeTagsAndUpdateState(tags);
  };

  // 미리보기 처리
  useEffect(() => {
    if (innerImg) {
      const url = URL.createObjectURL(innerImg);
      setPreviewInnerImg(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewInnerImg(null);
  }, [innerImg]);

  useEffect(() => {
    if (thumbMusic) {
      const url = URL.createObjectURL(thumbMusic);
      setPreviewMusic(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewMusic(null);
  }, [thumbMusic]);

  useEffect(() => {
    normalizeTagsAndUpdateState(tags);
  }, []);

  // 상위 컴포넌트로 값 전달
  useEffect(() => {
    if (authorId !== null && category !== null) {
      onChange({
        title,
        description,
        authorId,
        category,
        publicStatus,
        hashtags: tagList,
      });
    }
  }, [title, description, authorId, category, publicStatus, tagList]);

  const publicStatusOptions = [
    {
      value: PublicStatusOption.PUBLIC,
      icon: <HiGlobeAsiaAustralia size={20} />,
      label: "공개",
    },
    {
      value: PublicStatusOption.PRIVATE,
      icon: <TbShieldLock size={20} />,
      label: "비공개",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-[1000px] mx-auto min-h-[420px] ">
      {/* 헤더 + 공개여부 */}
      <div className="shrink-0 flex justify-between items-end mb-4 mr-4">
        <div className="text-xl font-semibold">세부정보 작성</div>
        <SelectableRadioField
          label=""
          name="publicStatus"
          value={publicStatus}
          onChange={(val) => setPublicStatus(val)}
          options={publicStatusOptions}
          border={false}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:h-[500px]">
        {/* 좌측 미리보기 영역 */}
        <div className="shrink-0 flex flex-col gap-3 w-full lg:w-[500px]">
          <div className=" min-w-[300px] min-h-[100px] flex justify-center items-center border border-gray-300 rounded-xl p-5">
            {previewInnerImg ? (
              <img
                src={previewInnerImg}
                alt="내부 이미지"
                className="object-contain max-h-full"
              />
            ) : (
              "내부이미지"
            )}
          </div>
          <div className="shrink-0 min-w-[300px] min-h-[150px] flex justify-center center items-center border border-gray-300 rounded-xl p-1">
            {previewMusic && (
              <div className="flex w-[100%] justify-center px-5">
                {/* <AudioLight
                  audioUrl={previewMusic}
                  audioTitle={thumbMusic?.name || "썸네일 음악 미리듣기"}
                /> */}
                <AudioWaveform
                  audioUrl={previewMusic}
                  mode="light"
                  audioTitle={thumbMusic?.name || "썸뮤직 음악 미리듣기"}
                  waveVisible={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* 우측 입력 영역 */}
        <div className="shrink-0 flex flex-col flex-1 gap-3 min-w-[450px]">
          {/* 제목 */}
          <InputField
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="제목을 입력하세요"
          />

          {/* 설명 */}
          <TextareaField
            label="설명"
            placeholder="설명을 입력하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
          />

          {/* 태그 */}
          <InputField
            label="태그"
            value={tags}
            onChange={handleTagChange}
            onBlur={handleTagBlur}
            maxLength={100}
            placeholder="#태그를 입력하고 스페이스바로 구분"
            extra={`${tagList.length} / 10`}
          />

          <div className="flex flex-row gap-3">
            {/* 카테고리 */}
            <CategorySelectField
              label="카테고리"
              value={category!}
              onChange={(val) => setCategory(val)}
              options={categories}
              placeholder="카테고리를 선택하세요"
            />

            {/* 작성자 선택 */}
            <AuthorSelectField
              label="작성자"
              value={
                authorId == null
                  ? ""
                  : `${authorId.name}  #${authorId.nickname}`
              }
              onClick={openModal}
              placeholder="작성자를 검색해서 선택하세요"
            />
          </div>
        </div>
      </div>

      {/* 작성자 검색 모달 */}
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
  );
}
