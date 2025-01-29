import InputField from "./InputField";
import ContainerTitle from "./ContainerTitle";
import { IoMdClose } from "react-icons/io";
import { IoMdCheckmark } from "react-icons/io";
import { EditableHouseData } from "../types/house";
import { TbHomeEdit } from "react-icons/tb";

type HouseFormProps = {
  houseData: EditableHouseData["house"];
  isEdit: boolean;
  onChange: (field: keyof EditableHouseData["house"], value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  toggleEdit: () => void;
};

export default function HouseForm({ houseData, isEdit, onChange, onSubmit, onCancel, toggleEdit }: HouseFormProps) {
  return (
    <div className="rounded-md p-7 mx-5 my-2  border border-[#df754b] ">
      {isEdit ? (
        <div className="flex gap-3 justify-end ">
          <div className="hover:text-[#df754b] cursor-pointer">
            <IoMdCheckmark size={20} onClick={onSubmit} />
          </div>

          <div className="hover:text-[#df754b] cursor-pointer">
            <IoMdClose size={20} onClick={onCancel} />
          </div>
        </div>
      ) : (
        <div className="flex justify-end hover:text-[#df754b] cursor-pointer">
          <TbHomeEdit size={20} onClick={toggleEdit} />
        </div>
      )}
      <ContainerTitle stepText="FIRST" headingText="하우스 정보" />

      <InputField
        label="House Title"
        id="house-title"
        value={houseData.title}
        readOnly={!isEdit}
        onChange={(e) => onChange("title", e.target.value)}
      />
      <InputField
        label="Author"
        id="house-author"
        value={houseData.author}
        readOnly={!isEdit}
        onChange={(e) => onChange("author", e.target.value)}
      />
      <InputField
        label="Description"
        id="house-description"
        value={houseData.description}
        readOnly={!isEdit}
        isSingleLine={false}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </div>
  );
}
