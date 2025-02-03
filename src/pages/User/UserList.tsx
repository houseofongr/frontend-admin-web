import { useEffect, useState } from "react";
import { User } from "../../types/user";
import API_CONFIG from "../../config/api";
import GridHeader from "../../components/GridHeader";
import { userListHeaderTitles } from "../../constants/listHeader";
import { userSearchOptions } from "../../constants/searchOptions";
import UserListItem from "../../components/user/UserListItem";
import Pagination from "../../components/Pagination";
import SpinnerIcon from "../../components/icons/SpinnerIcon";
import SearchComponent from "../../components/SearchComponent";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/users?page=${currentPage}&size=${size}`);
      const { users, pagination } = await response.json();
      console.log("usrs", users, pagination);
      setUsers(users);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalElements);
      setSize(pagination.size);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  // isLoading 일때 스피너아이콘
  // !users 일때 유저가 존재하지 않습니다.
  if (!users) return <SpinnerIcon />;

  return (
    <div className="flex-center mt-[25%] md:mt-[25%] lg:mt-[15%]">
      <div className="w-[60%]">
        <div className="flex items-center flex-col md:flex-row justify-between">
          <h1 className="font-bold text-base lg:text-lg">
            아・오・옹의 유저 {totalItems !== 0 && `|  ${totalItems} 명`}
          </h1>
          <SearchComponent onSearch={() => {}} options={userSearchOptions} />
        </div>

        <div className="flex items-center flex-col py-4">
          <GridHeader headerTitles={userListHeaderTitles} />
          {users.length === 0 && <div className="py-10 ">유저가 존재하지 않습니다.</div>}

          {users && (
            <ul className="w-full flex flex-col gap-5 ">
              {users.map((user, index) => {
                return <UserListItem key={user.id} index={index} user={user} currentPage={currentPage} size={size} />;
              })}
            </ul>
          )}
        </div>
        {totalPages !== 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>
    </div>
  );
}
