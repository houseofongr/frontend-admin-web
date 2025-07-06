import { useState, useEffect } from "react";
import { InputField } from "../../../components/Input/InputField";
import { TextareaField } from "../../../components/Input/TextareaField";
import { FaRegSave } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import WaveformWithAudioDark from "../../../components/Sound/WaveformWithAudioDark";
import { TbLock, TbLockOpen2 } from "react-icons/tb";
import { SelectableRadioField } from "../../../components/Input/SelectableRadioField";

interface DetailInfoStepProps {
  innerImg?: File | null;
  sound?: File | null;
  onSubmit: (title: string, description: string, hidden:boolean) => void;
}

export default function DetailInfoStep({
  innerImg,
  sound,
  onSubmit,
}: DetailInfoStepProps) {
  const [previewInnerImg, setPreviewInnerImg] = useState<string | null>(null);
  const [previewSound, setPreviewSound] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hidden, setHidden] = useState<boolean>(true);
  
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

  // 미리보기 처리
  useEffect(() => {
    if (innerImg) {
      const url = URL.createObjectURL(innerImg);
      setPreviewInnerImg(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewInnerImg(null);
  }, [innerImg]);

  // 사운드 미리듣기 처리
  useEffect(() => {
    if (sound) {
      const url = URL.createObjectURL(sound);
      setPreviewSound(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewSound(null);
  }, [sound]);

  return (
    <div className="flex mx-auto flex-col">
      <div className="shrink-0 text-xl font-semibold  mb-4">세부정보 작성</div>

      <div className="flex flex-col lg:flex-row gap-4 min-w-[500px] lg:min-w-[700px]">
        <div className="shrink-0 flex flex-1 flex-col gap-3 ">
          {/* 이미지 미리보기 박스 */}
          {previewInnerImg ? (
            <div className="max-w-full max-h-full border border-gray-300 rounded-xl px-15 py-10 overflow-hidden">
              <img
                src={previewInnerImg}
                alt="내부 이미지"
                className="block mx-auto max-w-full max-h-full object-contain"
              />
            </div>
          ) : (
            <></>
          )}

          {previewSound ? (
            <div className="max-w-full max-h-full border border-gray-300 rounded-xl overflow-hidden">
              <WaveformWithAudioDark audioUrl={previewSound} audioTitle={""} />
            </div>
          ) : (
            <></>
          )}

          <div className="shrink-0">
            <SelectableRadioField
              label="공개여부"
              name="publicStatus"
              value={hidden ? "true" : "false"}
              onChange={(val) => setHidden(val == "true")}
              options={hiddenOptions}
            />
          </div>
        </div>

        {/* 우측 입력 영역 */}
        <div className="shrink-0 flex flex-1 flex-col gap-3 ">
          {/* 제목 필드 */}
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
        </div>
      </div>
      {/* 제출 버튼 */}
      <div className="shrink-0 flex justify-end mt-2">
        <button
          onClick={() => onSubmit(title, description, hidden)}
          className="px-5 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 cursor-pointer transition flex flex-row justify-center gap-3 items-center"
        >
          <FiSave /> <p className="mt-1">완료</p>
        </button>
      </div>
    </div>
  );
}
