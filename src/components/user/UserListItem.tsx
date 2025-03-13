import SNSLabel from "../label/SNSLabel";
import { IoMdPhonePortrait } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/user";
import { formatDate } from "../../utils/formatDate";
import CircleButton from "../common/buttons/CircleButton";
import { userListHeaderTitles } from "../../constants/headerList";
import { BsHouseAdd } from "react-icons/bs";

interface UserListItemProps {
  user: User;
  currentPage: number;
  size: number;
  index: number;
}

export default function UserListItem({ user, currentPage, size, index }: UserListItemProps) {
  const navigation = useNavigate();
  const { id, realName, nickName, snsAccounts, phoneNumber, registeredDate } = user;
  const listNumber = (currentPage - 1) * size + index + 1;

  return (
    <li key={id} className="py-2 flex items-center text-center rounded-md bg-[#fbfafa] shadow ">
      <span style={{ width: userListHeaderTitles[0].width }}>{listNumber}</span>
      <div className="flex flex-col pl-10 pr-3  items-start" style={{ width: userListHeaderTitles[1].width }}>
        <span>{realName}</span>
        <span className="text-gray-500 text-sm break-words">#{nickName}</span>
      </div>
      <div style={{ width: userListHeaderTitles[2].width }}>
        {snsAccounts.map(({ domain, email }, index) => (
          <div key={index} className="flex px-2 gap-2 mb-1">
            <SNSLabel sns={domain} />
            <span>{email}</span>
          </div>
        ))}
      </div>
      <div className="flex-center gap-1" style={{ width: userListHeaderTitles[3].width }}>
        <IoMdPhonePortrait />
        <span>{phoneNumber}</span>
      </div>

      <div style={{ width: userListHeaderTitles[4].width }}>{formatDate(registeredDate)}</div>
      <div style={{ width: userListHeaderTitles[5].width }}>
        <CircleButton
          label={<BsHouseAdd size={25} color="#352f2f" className="hover:text-white" />}
          hasBorder={false}
          onClick={() => {
            navigation(`/users/${user.id}`);
          }}
        />
      </div>
    </li>
  );
}
