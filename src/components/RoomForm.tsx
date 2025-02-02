import { EditableRoomData } from "../types/house";
import CircleButton from "./buttons/CircleButton";
import ContainerTitle from "./ContainerTitle";
import InputField from "./InputField";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { TbHomeEdit } from "react-icons/tb";

type RoomFormProps = {
  rooms: EditableRoomData[];
  isEdit: boolean;
  onChange: (index: number, field: keyof EditableRoomData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  toggleEdit: () => void;
};

export default function RoomForm({ rooms, isEdit, onChange, onSubmit, onCancel, toggleEdit }: RoomFormProps) {
  return (
    <div className="rounded-md p-5 mx-5 my-2 border border-[#df754b] ">
      <div className="flex justify-between items-center mb-5">
        <ContainerTitle stepText="SECOND" headingText="방 정보" />

        {isEdit ? (
          <div className="flex gap-3 justify-end">
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
      {rooms.map((room, index) => (
        <InputField
          key={index}
          label={`ROOM ID #${room.roomId}`}
          id={`room-${room.imageId}`}
          value={room.name}
          readOnly={!isEdit}
          onChange={(e) => onChange(index, "name", e.target.value)}
        />
      ))}
    </div>
  );
}
