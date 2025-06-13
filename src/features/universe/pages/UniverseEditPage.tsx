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
  UniverseCategoryOptions,
} from "../../../constants/UniverseData";
import API_CONFIG from "../../../config/api";
import { Universe } from "../../../types/universe";
import ImageUploadModal from "../../../components/modal/ImageUploadModal";
import Modal from "../../../components/modal/Modal";
import UserSearch from "../create/UserSearch";
import { UserV2 } from "../../../types/user";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";
import { InputField } from "../../../components/Input/InputField";
import { TextareaField } from "../../../components/Input/TextareaField";
import { AuthorSelectField } from "../../../components/Input/AuthorSelectField";
import { SelectableRadioField } from "../../../components/Input/SelectableRadioField";
import { SelectField } from "../../../components/Input/SelectField";
import { useUniverseStore } from "../../../context/useUniverseStore";

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
  const [alert, setAlert] = useState<{
    text: string;
    type: AlertType;
    subText: string | null;
  } | null>(null);

  const { setCurrentSpaceId } = useUniverseStore();

  useEffect(() => {
    if (!isNaN(universeIdParsed)) fetchUniverse();
  }, [universeIdParsed]);

  const fetchUniverse = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/universes/${universeId}`);
      if (!response.ok) throw new Error("Failed to fetch universe.");
      const data: Universe = await response.json();

      setCurrentSpaceId(data.id!);
      setTags(data.hashtags.map((tag: string) => `#${tag}`).join(" "));
      setUniverse(data);
    } catch (error) {
      console.error(error);
    }
  };

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
      const response = await fetch(`${API_CONFIG.BACK_API}/universes/${universe.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("저장에 실패했습니다.");

      showAlert("변경사항이 저장되었습니다.", "success", null);
      navigate(-1);
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail", null);
    }
  };

  const saveInnerImg = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("innerImage", file);

      const response = await fetch(`${API_CONFIG.BACK_API}/universes/inner-image/${universeId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("저장에 실패했습니다.");
      showAlert("변경사항이 저장되었습니다.", "success", null);
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail", null);
    }
  };

  const saveThumbMusic = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("thumbMusic", file);

      const response = await fetch(`${API_CONFIG.BACK_API}/universes/thumb-music/${universeId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("저장에 실패했습니다.");
      showAlert("변경사항이 저장되었습니다.", "success", null);
    } catch (error) {
      console.error("저장 에러:", error);
      showAlert("저장 중 오류가 발생했습니다.", "fail", null);
    }
  };

  const handleCancel = () => {
    showAlert("저장하지 않은 변경사항이 사라집니다. 취소하시겠습니까?", "check", null);
  };

  const showAlert = (text: string, type: AlertType, subText: string | null) => {
    setAlert({ text, type, subText });
  };

  const normalizeTagsAndUpdateState = (raw: string) => {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    const normalized = parts.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
    const display = normalized.join(" ") + (raw.endsWith(" ") ? " " : "");
    const validTags = normalized.filter((t) => t.length > 1).map((t) => t.replace(/^#/, ""));
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

  const handleSaveInnerImage = (file: File) => {
    setShowInnerImgEdit(false);
    saveInnerImg(file);
  };

  const handleSaveThumbMusicImage = (file: File) => {
    setShowThumbMusicEdit(false);
    saveThumbMusic(file);
  };

  const publicStatusOptions = [
    { value: PublicStatusOption.PUBLIC, icon: <HiGlobeAsiaAustralia size={20} />, label: "공개" },
    { value: PublicStatusOption.PRIVATE, icon: <TbShieldLock size={20} />, label: "비공개" },
  ];

  const onSpaceDelete = () => {
    showAlert("정말로 스페이스를 삭제하시겠습니까?", "check", "* 관련된 이미지와 음원, 내부 스페이스 및 요소가 모두 삭제됩니다.");
  };

  return (
    <PageLayout>
      {alert && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => setAlert(null)}
          okButton={<Button label="확인" onClick={() => { alert.type === "check" ? navigate(-1) : setAlert(null) }} />}
          cancelButton={
            alert.type === "check" ? <Button label="취소" variant="gray" onClick={() => setAlert(null)} /> : undefined
          }
          {...(alert.subText ? { subText: alert.subText } : {})}
        />
      )}

      <section className="w-full mx-8 py-20 md:py-10 p-3 lg:w-[90%]">
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

        <div className="flex flex-col lg:flex-row gap-4 p-3 w-full h-screen min-h-[550px] lg:max-h-[calc(100vh-150px)]">
          <div className="flex flex-2 flex-col gap-3 h-[100%]">
            <div className="min-h-[200px] bg-black rounded-xl">
              <UniverseEditInnerImg onEdit={() => setShowInnerImgEdit(true)} onDelete={onSpaceDelete} />
            </div>
            <div className="lg:min-h-[130px] flex-col min-h-[280px]">
              <UniverseEditMusic thumbMusicId={universe.thumbMusicId} onEdit={() => setShowThumbMusicEdit(true)} />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 h-[100%]">
            <InputField
              label="제목"
              value={universe.title}
              onChange={(e) => setUniverse((prev) => ({ ...prev, title: e.target.value }))}
              maxLength={100}
              placeholder="제목을 입력하세요"
            />
            <TextareaField
              label="설명"
              value={universe.description || ""}
              onChange={(e) => setUniverse((prev) => ({ ...prev, description: e.target.value }))}
              maxLength={500}
              placeholder="설명을 입력하세요"
            />
            <SelectField
              label="카테고리"
              value={universe.category}
              onChange={(val) => setUniverse((prev) => ({ ...prev, category: val }))}
              options={UniverseCategoryOptions}
              placeholder="카테고리를 선택하세요"
            />
            <SelectableRadioField
              label="공개여부"
              name="publicStatus"
              value={universe.publicStatus}
              onChange={(val) => setUniverse((prev) => ({ ...prev, publicStatus: val }))}
              options={publicStatusOptions}
            />
            <InputField
              label="태그"
              value={tags}
              onChange={handleTagChange}
              onBlur={() => normalizeTagsAndUpdateState(tags)}
              maxLength={100}
              placeholder="#태그를 입력하고 스페이스바로 구분"
              extra={`${universe.hashtags?.length} / 10`}
            />
            <AuthorSelectField
              label="작성자"
              value={universe.author || ""}
              onClick={() => setShowAuthorEdit(true)}
              placeholder="작성자를 검색해서 선택하세요"
            />
          </div>
        </div>
      </section>

      {showInnerImgEdit && (
        <ImageUploadModal
          title="유니버스 이미지 수정"
          description="내부 이미지를 변경할 수 있습니다."
          labelText="내부이미지"
          maxFileSizeMB={5}
          onClose={() => setShowInnerImgEdit(false)}
          onConfirm={handleSaveInnerImage}
          confirmText="저장"
          requireSquare
        />
      )}

      {showThumbMusicEdit && (
        <ThumbMusicEditModal
          onClose={() => setShowThumbMusicEdit(false)}
          handleSaveThumbMusicImage={handleSaveThumbMusicImage}
        />
      )}

      {showAuthorEdit && (
        <Modal onClose={() => setShowAuthorEdit(false)} bgColor="white">
          <UserSearch
            isOpen={showAuthorEdit}
            onClose={() => setShowAuthorEdit(false)}
            onSelect={(user: UserV2) => {
              setUniverse((prev) => ({ ...prev, authorId: user.id, author: user.name }));
            }}
          />
        </Modal>
      )}
    </PageLayout>
  );
}
