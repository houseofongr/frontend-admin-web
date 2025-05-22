import { useEffect, useState } from "react";
import { Universe } from "../../types/universe";
import GridHeader from "../../components/GridHeader";
import { universeListHeaderTitles } from "../../constants/headerList";
import { userSearchOptions as universeOptions } from "../../constants/searchOptions";
import { categoryOptions as categoryOptions } from "../../constants/searchOptions";
import Pagination from "../../components/Pagination";
import SearchComponent from "../../components/SearchComponent";
import PageLayout from "../../components/layout/PageLayout";
import { UNIVERSE_DATA } from "../../mocks/universe-data";
import UniverseListItem from "../../components/pageComponent/universe/UniverseListItem";
import { GoPlusCircle } from "react-icons/go";
import CategorySelect from "../../components/pageComponent/universe/CategorySelect";
import { AOO_COLOR } from "../../constants/color";


export default function UniverseList() {
  const [universe, setUniverse] = useState<Universe[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

  const fetchUniverse = async () => {
    try {
      // const response = await fetch(
      //   `${API_CONFIG.BACK_API}/admin/universes?page=${currentPage}&size=${size}`
      // );
      // const { universes, pagination } = await response.json();
      const response = UNIVERSE_DATA;
      const universes  = response.universes;
      const pagination = response.pagination;

      setUniverse(universes);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalElements);
      setSize(pagination.size);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUniverse();
  }, [currentPage]);

  // if (!users) return <SpinnerIcon />;

  // const universe
  
  // const searchHandler = (filter: string, query: string) => {
  //   let results = houses;
  //   if (filter === "house-title") {
  //     results = houses.filter((house) =>
  //       house.title.toLowerCase().includes(query.toLowerCase())
  //     );
  //   } else if (filter === "author") {
  //     results = houses.filter((house) =>
  //       house?.author?.toLowerCase().includes(query.toLowerCase())
  //     );
  //   } else if (filter === "all") {
  //     results = houses.filter(
  //       (house) =>
  //         house.title.toLowerCase().includes(query.toLowerCase()) ||
  //         house?.author?.toLowerCase().includes(query.toLowerCase())
  //     );
  //   }

  //   setFilteredHouses(results);
  // };

  return (
    <PageLayout>
      <section className="w-[65%]  py-10 md:py-20">
        <div className="flex items-center flex-col md:flex-row justify-between pb-3">
          <div className="flex items-center space-x-5">
            <h1 className="font-bold text-base lg:text-lg">
              아・오・옹의 유니버스{" "}
              {totalItems !== 0 && ` ・  ${totalItems} 개`}
            </h1>
            <GoPlusCircle
              size={23}
              className={`cursor-pointer  hover:text-[${AOO_COLOR.Orange}]`}
            />
          </div>
          <div className="flex items-center">
            <CategorySelect onSearch={() => {}} options={categoryOptions} />
            <SearchComponent onSearch={() => {}} options={universeOptions} />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between"></div>

        <div className="flex items-center flex-col py-4">
          <GridHeader headerTitles={universeListHeaderTitles} />
          {universe.length === 0 && (
            <div className="py-10 ">유니버스가 존재하지 않습니다.</div>
          )}
          {universe && (
            <ul className="w-full flex flex-col gap-5 ">
              {universe.map((universe, index) => {
                return (
                  <UniverseListItem
                    key={universe.id}
                    universe={universe}
                    onDelete={(id: number) => {
                      console.log(id + " Delete");
                    }}
                    onEdit={(id: number) => {
                      console.log(id + " Edit");
                    }}
                    onEditThumbnail={(id: number) => {
                      console.log(id + " Edit Thumbnail");
                    }}
                    onPlayMusic={(id: number) => {
                      console.log(id + " Play Music");
                    }}
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
      </section>
    </PageLayout>
  );
}
