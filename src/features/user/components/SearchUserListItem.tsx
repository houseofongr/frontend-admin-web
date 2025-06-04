import SNSLabel from "../../../components/label/SNSLabel";
import { UserV2 } from "../../../types/user";
import { convertUnixToDate, formatDate } from "../../../utils/formatDate";
import { searchUserListHeaderTitles } from "../../../constants/headerList";

interface UserListItemProps {
  user: UserV2;
  onSelect: (user: UserV2) => void;
}

export default function SearchUserListItem({
  user,
  onSelect,
}: UserListItemProps) {
  const {
    id,
    name,
    nickname,
    phoneNumber,
    email,
    registeredDate,
    termsOfUseAgreement,
    personalInformationAgreement,
    snsAccounts,
  } = user;
  return (
    <li
      key={id}
      onClick={() => {
        onSelect(user);
      }}
      className="px-2 py-2 flex items-center text-center rounded-md bg-[#fbfafa] shadow hover:bg-gray-100 cursor-pointer"
    >
      <div
        className="flex flex-col pr-3  items-center "
        style={{ width: searchUserListHeaderTitles[0].width }}
      >
        <span className="text-sm">{name}</span>
        <span className="text-gray-500 text-sm break-words">#{nickname}</span>
      </div>
      <div style={{ width: searchUserListHeaderTitles[1].width }}>
        {snsAccounts.map(({ domain, email }, index) => (
          <div key={index} className="flex px-2 gap-2 mb-1">
            <SNSLabel sns={domain} />
            <span className="text-sm">{email}</span>
          </div>
        ))}
      </div>
      <div
        className="flex-center gap-1 px-3"
        style={{ width: searchUserListHeaderTitles[2].width }}
      >
        <span className="text-sm">{phoneNumber}</span>
      </div>

      <div style={{ width: searchUserListHeaderTitles[3].width }}>
        <span className="text-sm"> {convertUnixToDate(registeredDate).default}</span>
      </div>
    </li>
  );
}
