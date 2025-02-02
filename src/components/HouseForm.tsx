import InputField from "./InputField";
import ContainerTitle from "./ContainerTitle";
import { EditableHouseData } from "../types/house";
import CircleButton from "./buttons/CircleButton";
import { IoMdClose, IoMdCheckmark, TbHomeEdit } from "./icons";

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
    <div className="rounded-md p-5 mx-5 my-2 border border-[#df754b]  ">
      <div className="flex justify-between items-center mb-5">
        <ContainerTitle stepText="FIRST" headingText="하우스 정보" />

        {isEdit ? (
          <div className="flex gap-3 justify-end ">
            <div className="flex justify-end">
              <CircleButton label={<IoMdCheckmark size={15} color="gray" />} onClick={onSubmit} />
            </div>
            <div className="flex justify-end">
              <CircleButton label={<IoMdClose size={15} color="gray" />} onClick={onCancel} />
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <CircleButton label={<TbHomeEdit size={15} color="gray" />} onClick={toggleEdit} />
          </div>
        )}
      </div>

      <InputField
        label="HOUSE TITLE"
        id="house-title"
        value={houseData.title}
        readOnly={!isEdit}
        onChange={(e) => onChange("title", e.target.value)}
      />
      <InputField
        label="AUTHOR"
        id="house-author"
        value={houseData.author}
        readOnly={!isEdit}
        onChange={(e) => onChange("author", e.target.value)}
      />
      <InputField
        label="DESCRIPTION"
        id="house-description"
        value={houseData.description}
        readOnly={!isEdit}
        isSingleLine={false}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </div>
  );
}
