import { BiToggleLeft, BiToggleRight } from "react-icons/bi";
import CustomInput from "../CustomInput";
import CardLabel from "../label/CardLabel";
import FileName from "../houseEditor/FileName";
import { useEffect, useState } from "react";
import FileUploadButton from "../common/buttons/FileUploadButton";
import Button from "../common/buttons/Button";
import { SoundMetadata, SoundSource } from "../../types/sound";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSound, deleteSound, updateSound } from "../../service /soundService";
import { MdCancel } from "react-icons/md";
import { bytesToKB } from "../../utils/formatFileSize";

type SoundFormProps = {
  itemId: number;
  soundOriginData?: SoundSource;
  soundId: number | null;
};

const initialData = {
  name: "",
  description: "",
  isActive: false,
};

export default function NewSoundForm({ itemId, soundOriginData, soundId }: SoundFormProps) {
  console.log("itemID", itemId);
  const [soundMetaData, setSoundMetaData] = useState<SoundMetadata>(initialData);
  const [file, setFile] = useState<File | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createSound(itemId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["itemSounds", itemId],
      });
    },
    onError: (error) => {
      console.error("Error creating sound source:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => updateSound(soundId!, soundMetaData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["itemSounds", itemId],
      });
      setSoundMetaData(initialData);
    },
    onError: (error) => {
      console.error("Error updating sound source:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSound(soundId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["itemSounds", itemId],
      });
      setSoundMetaData(initialData);
    },
    onError: (error) => {
      console.error("Error deleting sound source:", error);
    },
  });
  const handleUpdateSoundData = () => {
    updateMutation.mutate();
    setIsEdit(false);
  };

  const handleDeleteSoundData = () => {
    if (soundId) {
      deleteMutation.mutate();
    }
    setIsEdit(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSoundMetaData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleIsActive = () => {
    setSoundMetaData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const saveSoundDataHandler = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    if (soundMetaData.description.length === 0 || soundMetaData.name.length === 0) {
      alert("form을 완성시켜주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("metadata", JSON.stringify(soundMetaData));
    formData.append("soundFile", file);

    createMutation.mutate(formData);
    // 폼 데이터랑 파일값 초기화..
    setSoundMetaData(initialData);
    setFile(null);
    setIsEdit(false); // new form 상태
  };

  useEffect(() => {
    if (soundOriginData) {
      setSoundMetaData({
        name: soundOriginData.name,
        description: soundOriginData.description,
        isActive: soundOriginData.isActive,
      });
      setIsEdit(true);
    }
  }, [soundId, itemId]);

  return (
    <div className="flex flex-col h-full w-[50%] ">
      <div className="text-center py-4">{isEdit ? `소리 정보` : "새로운 소리"}</div>

      <form className="flex flex-col gap-1 px-3">
        <div className="flex flex-col ">
          <div>
            <CardLabel text={"NAME"} hasBorder={false} hasPadding={false} />
          </div>
          <CustomInput name="name" value={soundMetaData.name} onChange={handleChange} />
        </div>
        <div className="flex flex-col w-full">
          <div>
            <CardLabel text={"DESCRIOTION"} hasBorder={false} hasPadding={false} />
          </div>
          <CustomInput name="description" value={soundMetaData.description} elType="textarea" onChange={handleChange} />
        </div>
        <div className="flex items-center gap-1 pb-3">
          <button type="button" onClick={toggleIsActive} className="focus:outline-none cursor-pointer w-[30px]">
            {soundMetaData.isActive ? (
              <BiToggleLeft size={25} color="#F5946D" />
            ) : (
              <BiToggleRight size={25} color="gray" />
            )}
          </button>
          <span className="text-sm">{soundMetaData.isActive ? "Active" : "Inactive"}</span>
        </div>

        {isEdit ? (
          <div className="mt-4 flex justify-evenly gap-4">
            <Button label="UPDATE" onClick={handleUpdateSoundData} />
            <Button label="DELETE" onClick={handleDeleteSoundData} />
            <Button
              label="NEW"
              onClick={() => {
                setIsEdit(false);
                setSoundMetaData(initialData);
                setFile(null);
              }}
            />
          </div>
        ) : (
          <div>
            <input id="sound-file" type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
            <FileUploadButton htmlFor="sound-file" />
            {file && (
              <div className="w-full flex justify-between items-center py-4">
                <FileName fileName={file.name} />
                <span className="text-xs"> {bytesToKB(file.size)} </span>
                <button className="cursor-pointer" onClick={() => setFile(null)}>
                  <MdCancel />
                </button>
              </div>
            )}
            <div className="flex-center">{file && <Button label="SUBMIT" onClick={saveSoundDataHandler} />}</div>
          </div>
        )}
      </form>
    </div>
  );
}
