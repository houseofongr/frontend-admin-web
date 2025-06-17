import { IoLockOpenOutline, IoPlanetOutline } from "react-icons/io5";
import IconTitleModal from "../../../components/modal/IconTitleModal";
import { TextareaField } from "../../../components/Input/TextareaField";
import { PublicStatusOption } from "../../../constants/UniverseData";
import { useState } from "react";
import { SelectableRadioField } from "../../../components/Input/SelectableRadioField";
import { InputField } from "../../../components/Input/InputField";
import { BiSave } from "react-icons/bi";
import { TiLockClosed, TiLockOpen } from "react-icons/ti";
import { TbLock, TbLockOpen2 } from "react-icons/tb";


interface SpaceInfoEditModalJProps {
  onClose: () => void;
  initTitle: string;
  initDescription: string;
  initHidden: boolean;
  handleSaveInfo: (title: string, description: string, hidden: boolean) => void;
}

export default function SpaceInfoEditModal({
  initTitle,
  initDescription,
  initHidden,
  onClose,
  handleSaveInfo,
}: SpaceInfoEditModalJProps) {
  const [title, setTitle] = useState<string>(initTitle);
  const [description, setDescription] = useState<string>(initDescription);
  const [hidden, setHidden] = useState<boolean>(initHidden);

  const hiddenOptions = [
    {
      value: "false",
      icon: <TbLockOpen2 size={20} />,
      label: "표시",
    },
    {
      value: "true",
      icon: <TbLock size={20} />,
      label: "숨김",
    },
  ];

  return (
    <IconTitleModal
      onClose={onClose}
      title="세부정보 수정"
      description="스페이스의 세부 정보를 변경할 수 있습니다."
      icon={<IoPlanetOutline size={20} />}
      bgColor="white"
    >
      <div className="flex flex-col gap-3 min-w-[550px] h-[80vh] min-h-[400px]">
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
          value={description}
          placeholder="설명을 입력하세요"
          onChange={(e) => setDescription(e.target.value)}
          maxLength={5000}
        />

        <SelectableRadioField
          label="공개여부"
          name="publicStatus"
          value={hidden ? "true": "false"}
          onChange={(val) => setHidden(val == "true")}
          options={hiddenOptions}
        />
        <div className="flex justify-end mt-3 mr-1">
          <button
            onClick={() =>
              handleSaveInfo(
                title,
                description,
                hidden
              )
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary text-primary hover:opacity-70 transition"
          >
            <BiSave size={18} />
            저장
          </button>
        </div>
      </div>
    </IconTitleModal>
  );
}
