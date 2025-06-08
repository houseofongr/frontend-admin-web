import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiGlobeAsiaAustralia } from "react-icons/hi2";
import { TbShieldLock } from "react-icons/tb";
import { BiSave } from "react-icons/bi";

import PageLayout from "../../../components/layout/PageLayout";
import UniverseEditInnerImg from "../edit/UniverseEditInnerImg";
import UniverseEditMusic from "../edit/UniverseEditMusic";
import ThumbMusicEditModal from "../edit/ThumbMusicEditModal";

import {
  PublicStatusOption,
  UniverseCategory,
} from "../../../constants/UniverseData";
import API_CONFIG from "../../../config/api";
import { Universe } from "../../../types/universe";
import ImageUploadModal from "../../../components/modal/ImageUploadModal";
import Modal from "../../../components/modal/Modal";
import UserSearch from "../create/UserSearch";
import { FiSearch } from "react-icons/fi";
import { UserV2 } from "../../../types/user";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";

export default function UniverseEditPage() {
  const { universeId } = useParams();
  const navigate = useNavigate();
  const universeIdParsed = parseInt(universeId || "", 10);

  const [universe, setUniverse] = useState<Universe>({
    id: 0,
    thumbnailId: -1,
    thumbMusicId: -1,
    innerImageId: -1,
    createdTime: Date.now(),
    updatedTime: Date.now(),
    view: 0,
    like: 0,
    title: "",
    description: "",
    category: "",
    publicStatus: "PRIVATE",
    hashtags: [],
    authorId: 0,
    author: "",
  });

  const [tags, setTags] = useState("");
  const [showInnerImgEdit, setShowInnerImgEdit] = useState(false);
  const [showThumbMusicEdit, setShowThumbMusicEdit] = useState(false);
  const [showAuthorEdit, setShowAuthorEdit] = useState(false);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(
    null
  );

  const [innerImageId, setInnerImageId] = useState<number>(0);
  const [thumbMusicId, setThumbMusicId] = useState<number>(0);

  // Universe 데이터 불러오기
  const fetchUniverse = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BACK_API}/universes/${universeId}`
      );
      if (!response.ok) throw new Error("Failed to fetch universe.");
      const data: Universe = await response.json();

      setInnerImageId(data.innerImageId);
      setThumbMusicId(data.thumbMusicId);

      setTags(data.hashtags.map((tag: string) => `#${tag}`).join(" "));
      setUniverse(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isNaN(universeIdParsed)) {
      fetchUniverse();
    }
  }, [universeIdParsed]);

  const saveDetail = async () => {
    const payload = {
      title: universe.title,
      description: universe.description,
      authorId: universe.authorId,
      category: universe.category,
      publicStatus: universe.publicStatus,
      hashtags: universe.hashtags,
    };

    try {
      const response = await fetch(
        `${API_CONFIG.BACK_API}/universes/${universe.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("저장에 실패했습니다.");

      showAlert("변경사항이 저장되었습니다.", "success");
      navigate(-1);
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail");
    }
  };

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };

  const saveInnerImg = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("innerImage", file);

      const response = await fetch(
        `${API_CONFIG.BACK_API}/universes/inner-image/${universeId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("저장에 실패했습니다.");

      showAlert("변경사항이 저장되었습니다.", "success");
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail");
    }
  };

  const saveThumbMusic = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("thumbMusic", file);

      const response = await fetch(
        `${API_CONFIG.BACK_API}/universes/thumb-music/${universeId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("저장에 실패했습니다.");

      showAlert("변경사항이 저장되었습니다.", "success");
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail");
    }
  };

  const handleCancel = () => {
    showAlert("저장하지 않은 변경사항이 사라집니다. 취소하시겠습니까?", "info");
  };

  // 태그 처리
  const normalizeTagsAndUpdateState = (raw: string) => {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    const normalized = parts.map((tag) =>
      tag.startsWith("#") ? tag : `#${tag}`
    );
    const display = normalized.join(" ") + (raw.endsWith(" ") ? " " : "");
    const validTags = normalized
      .filter((t) => t.length > 1)
      .map((t) => t.replace(/^#/, ""));
    setTags(display);
    setUniverse((prev) => ({ ...prev, hashtags: validTags }));
  };

  const handleTagChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(" ")) {
      normalizeTagsAndUpdateState(val);
    } else {
      setTags(val);
    }
  };

  function handleSaveInnerImage(file: File): void {
    setShowInnerImgEdit(false);
    saveInnerImg(file);
  }

  function handleSaveThumbMusicImage(file: File): void {
    setShowThumbMusicEdit(false);
    saveThumbMusic(file);
  }

  return (
    <PageLayout>
      {alert && alert?.type != "info" && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={
            <Button
              label="확인"
              onClick={() => {
                setAlert(null);
              }}
            />
          }
        />
      )}
      {alert && alert?.type == "info" && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={
            <Button
              label="취소"
              variant="gray"
              onClick={() => {
                navigate(-1);
              }}
            />
          }
          cancelButton={
            <Button
              label="돌아가기"
              onClick={() => {
                setAlert(null);
              }}
            />
          }
        />
      )}

      <section className="w-full mx-8 py-20 md:py-10 p-3 lg:w-[90%]">
        {/* 상단 버튼 영역 */}
        <div className="px-3 flex justify-between">
          <h1 className="font-bold text-base lg:text-lg">유니버스 상세 정보</h1>
          <div className="w-[35%] mr-1 flex justify-end gap-2">
            <button
              onClick={saveDetail}
              className="flex items-center gap-3 px-4 py-1.5 text-sm rounded-xl border-2 border-primary text-primary hover:opacity-70 transition"
            >
              <BiSave size={18} /> 변경내역 저장
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 border-2 border-gray-300 text-sm text-gray-400 rounded-xl hover:opacity-70 transition"
            >
              취소
            </button>
          </div>
        </div>

        {/* 본문 영역 */}
        <div
          className={`flex flex-col lg:flex-row gap-4 p-3 w-full h-screen min-h-[550px]
        lg:max-h-[calc(100vh-150px)]`}
        >
          {/* 왼쪽 - 이미지 & 오디오 */}
          <div className="flex flex-2 flex-col gap-3 h-[100%]">
            <div className="h-min-[200px] bg-black rounded-xl">
              <UniverseEditInnerImg
                innerImageId={universe.innerImageId}
                onEdit={() => setShowInnerImgEdit(true)}
              />
            </div>
            <div className="lg:min-h-[130px] flex-col min-h-[280px]">
              {/* 썸뮤직 미리듣기 */}
              <UniverseEditMusic
                thumbMusicId={universe.thumbMusicId}
                onEdit={() => setShowThumbMusicEdit(true)}
              />
            </div>
          </div>

          {/* 오른쪽 - 텍스트 입력 */}
          <div className="flex flex-1 flex-col gap-3 h-[100%]">
            {/* 제목 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2">
              <label className="text-neutral-500 mb-0.5">제목</label>
              <input
                value={universe.title}
                onChange={(e) =>
                  setUniverse((prev) => ({ ...prev, title: e.target.value }))
                }
                className="outline-none bg-transparent w-full text-gray-900"
                maxLength={100}
                placeholder="제목을 입력하세요"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {universe.title.length} / 100
              </div>
            </div>

            {/* 설명 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2 grow">
              <label className="text-neutral-500 mb-0.5">설명</label>
              <textarea
                value={universe.description}
                onChange={(e) =>
                  setUniverse((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="outline-none bg-transparent w-full h-full text-gray-900 mb-5"
                maxLength={500}
                placeholder="설명을 입력하세요"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {universe.description?.length} / 500
              </div>
            </div>

            {/* 카테고리 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2">
              <label className="text-neutral-500 mb-0.5">카테고리</label>
              <select
                value={universe.category}
                onChange={(e) =>
                  setUniverse((prev) => ({ ...prev, category: e.target.value }))
                }
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
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2">
              <label className="text-neutral-500 mb-0.5">공개여부</label>
              <div className="flex space-x-10 justify-center">
                {[
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
                ].map(({ value, icon, label }) => (
                  <label
                    key={value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="isPublic"
                      checked={universe.publicStatus === value}
                      onChange={() =>
                        setUniverse((prev) => ({
                          ...prev,
                          publicStatus: value,
                        }))
                      }
                      className="hidden"
                    />
                    <span className="h-5 w-5 border border-neutral-500 rounded-full flex items-center justify-center">
                      {universe.publicStatus === value && (
                        <span className="h-3 w-3 bg-neutral-400 rounded-full" />
                      )}
                    </span>
                    <span className="flex items-center gap-2 text-neutral-600">
                      {icon} {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 태그 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2">
              <label className="text-neutral-500 mb-0.5">태그</label>
              <input
                value={tags}
                onChange={handleTagChange}
                onBlur={() => normalizeTagsAndUpdateState(tags)}
                placeholder="#태그를 입력하고 스페이스바로 구분"
                className="outline-none bg-transparent w-full text-gray-900"
              />
              <div className="absolute bottom-2 right-4 text-xs text-gray-500">
                {universe.hashtags?.length || 0} / 10
              </div>
            </div>

            {/* 작성자 선택 */}
            <div className="relative flex flex-col border border-gray-300 rounded-xl px-5 pt-3 pb-2">
              <label className="text-neutral-500 mb-1">작성자</label>
              <div
                className="relative w-full"
                onClick={() => setShowAuthorEdit(true)}
              >
                <input
                  type="text"
                  value={universe.author == null ? "" : `${universe.author}`}
                  readOnly
                  placeholder="작성자를 검색해서 선택하세요"
                  className="w-full pr-10 cursor-pointer bg-transparent outline-none text-gray-900"
                />
                <FiSearch
                  size={20}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 모달들 */}
      {showInnerImgEdit && (
        <ImageUploadModal
          title="유니버스 이미지 수정"
          description="내부 이미지를 변경할 수 있습니다."
          labelText="내부이미지"
          maxFileSizeMB={5}
          onClose={() => setShowInnerImgEdit(false)}
          onConfirm={(file) => handleSaveInnerImage(file)}
          confirmText="저장"
          requireSquare={true}
        />
      )}
      {showThumbMusicEdit && (
        <ThumbMusicEditModal
          onClose={() => setShowThumbMusicEdit(false)}
          handleSaveThumbMusicImage={handleSaveThumbMusicImage}
        />
      )}

      {/* 작성자 검색 모달 */}
      {showAuthorEdit && (
        <Modal onClose={() => setShowAuthorEdit(false)} bgColor="white">
          <UserSearch
            isOpen={showAuthorEdit}
            onClose={() => setShowAuthorEdit(false)}
            onSelect={(user: UserV2) => {
              setUniverse((prev) => ({
                ...prev,
                authorId: user.id,
                author: user.name,
              }));
            }}
          />
        </Modal>
      )}
    </PageLayout>
  );
}
