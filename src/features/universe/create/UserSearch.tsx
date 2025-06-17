import { useEffect, useState } from "react";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import SearchComponent from "../../../components/SearchComponent";
import { UserV2 } from "../../../types/user";
import API_CONFIG from "../../../config/api";
import GridHeader from "../../../components/GridHeader";
import { searchUserListHeaderTitles } from "../../../constants/headerList";
import { userSearchOptions } from "../../../constants/searchOptions";
import Pagination from "../../../components/Pagination";
import SearchUserListItem from "../../user/components/SearchUserListItem";

interface AuthorSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: UserV2) => void;
}

export default function UserSearch({
  isOpen,
  onClose,
  onSelect,
}: AuthorSearchModalProps) {
  if (!isOpen) return null;

  const [users, setUsers] = useState<UserV2[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = async (
    filter?: string,
    query?: string,
    page = currentPage
  ) => {
    try {
      setLoading(true);
      const searchParams = new URLSearchParams();

      searchParams.append("page", page.toString());
      searchParams.append("size", size.toString());

      if (filter && query) {
        searchParams.append("searchType", filter);
        searchParams.append("keyword", query);
      }

      const response = await fetch(
        `${API_CONFIG.BACK_API}/users/v2?${searchParams}`
      );
      const { users, pagination } = await response.json();
      setUsers(users);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalElements);
      setSize(pagination.size);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  if (!users) return <SpinnerIcon />;

  const onSelectUser = (selectedUser: UserV2) => {
    onSelect(selectedUser); // 필요에 따라 nickName 등도 함께 넘겨도 됨
    onClose(); // 모달 닫기
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-full h-[500px]">
      <h2 className="text-xl font-semibold mb-4">회원 찾기</h2>

      <div className="flex items-center flex-col md:flex-row justify-between">
        <h2 className="font-bold text-base mr-10">
          아・오・옹의 유저 {totalItems !== 0 && ` ・  ${totalItems} 명`}
        </h2>
        <SearchComponent
          onSearch={(filter: string, query: string) => {
            fetchUsers(filter, query, 1);
          }}
          options={userSearchOptions}
        />
      </div>

      <div className="flex items-center flex-col py-4">
        <GridHeader headerTitles={searchUserListHeaderTitles} />
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
            <SpinnerIcon />
          </div>
        )}
        {!loading && users.length === 0 && (
          <div className="py-10 ">유저가 존재하지 않습니다.</div>
        )}
        {users && (
          <ul className="w-full flex flex-col gap-5 ">
            {users.map((user) => {
              return (
                <SearchUserListItem
                  key={user.id}
                  user={user}
                  onSelect={onSelectUser}
                />
              );
            })}
          </ul>
        )}
      </div>
      {totalPages !== 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
