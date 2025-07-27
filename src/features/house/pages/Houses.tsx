import { useEffect, useState } from "react";
import { House } from "../../../types/house";
import API_CONFIG from "../../../config/api";
import SearchComponent from "../../../components/SearchComponent";
import { houseSearchOptions } from "../../../constants/searchOptions";
import { Link } from "react-router-dom";
import GridHouseList from "../components/GridHouseList";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import Button from "../../../components/buttons/Button";
import PageLayout from "../../../components/layout/PageLayout";

export default function HouseList() {
  const [houses, setHouses] = useState<House[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [size, setSize] = useState<number>(9);
  const [pageNum, setPageNum] = useState<number>(0);

  const fetchHouses = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/houses?page=${pageNum + 1}&size=${size}`);

      if (!response.ok) {
        throw new Error("Failed to fetch houses");
      }
      const { houses, pagination } = await response.json();

      setHouses(houses);
      setFilteredHouses(houses);

      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalElements);
      setSize(pagination.size);
      setPageNum(pagination.pageNumber);
    } catch (error) {
      console.error("하우스 리스트 조회 fetching error:", error);
    }
  };

  const searchHandler = (filter: string, query: string) => {
    let results = houses;
    if (filter === "house-title") {
      results = houses.filter((house) => house.title.toLowerCase().includes(query.toLowerCase()));
    } else if (filter === "author") {
      results = houses.filter((house) => house?.author?.toLowerCase().includes(query.toLowerCase()));
    } else if (filter === "all") {
      results = houses.filter(
        (house) =>
          house.title.toLowerCase().includes(query.toLowerCase()) ||
          house?.author?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredHouses(results);
  };

  useEffect(() => {
    fetchHouses();
  }, [currentPage]);

  if (!filteredHouses) return <SpinnerIcon />;
  return (
    <PageLayout>
      <div className="w-[90%] flex flex-col  mx-8 py-10 md:py-20 ">
        <div className="flex justify-between pb-10">
          <h1 className="font-bold text-base md:text-lg ">
            아・오・옹의 하우스 {totalItems !== 0 && ` ・ ${totalItems} 개`}
          </h1>
          <div className="flex justify-center items-center gap-5">
            <SearchComponent onSearch={searchHandler} options={houseSearchOptions} />
            <Link to={"/houses/house-editor"}>
              <Button label="NEW" />
            </Link>
          </div>
        </div>

        <GridHouseList
          houses={filteredHouses}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          totalItems={totalItems}
        />
      </div>
    </PageLayout>
  );
}
