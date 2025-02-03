import SNSLabel from "../label/SNSLabel";
import { TbHomePlus } from "react-icons/tb";
import { IoMdPhonePortrait } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/user";
import { formatDate } from "../../utils/formatDate";
import CircleButton from "../common/buttons/CircleButton";

interface UserListItemProps {
  user: User;
  currentPage: number;
  size: number;
  index: number;
}

export default function UserListItem({ user, currentPage, size, index }: UserListItemProps) {
  const navigation = useNavigate();
  const listNumber = (currentPage - 1) * size + index + 1;

  return (
    <li key={user.id} className="py-2 flex items-center text-center rounded-md bg-[#fbfafa] shadow ">
      <span style={{ width: "5%" }}>{listNumber}</span>
      <div className="flex flex-col pl-10 pr-3  items-start" style={{ width: "20%" }}>
        <span>{user.realName}</span>
        <span className="text-gray-500 text-sm break-words">#{user.nickName}</span>
      </div>
      <div style={{ width: "25%" }}>
        {user.snsAccounts.map(({ domain, email }, index) => (
          <div key={index} className="flex px-2 gap-2 mb-1">
            <SNSLabel sns={domain} />
            <span>{email}</span>
          </div>
        ))}
      </div>
      <div className="flex-center gap-1" style={{ width: "20%" }}>
        <IoMdPhonePortrait />
        <span>{user.phoneNumber}</span>
      </div>

      <div style={{ width: "15%" }}>{formatDate(user.registeredDate)}</div>
      <div style={{ width: "15%" }}>
        <CircleButton
          label={<TbHomePlus size={25} color="#352f2f" className="hover:text-white" />}
          onClick={() => {
            navigation(`/users/${user.id}`);
          }}
        />
      </div>
    </li>
  );
}
