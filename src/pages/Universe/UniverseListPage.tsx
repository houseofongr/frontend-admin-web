import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Universe } from "../../types/universe";
import GridHeader from "../../components/GridHeader";
import { universeListHeaderTitles } from "../../constants/headerList";
import { userSearchOptions as universeOptions } from "../../constants/searchOptions";
import Pagination from "../../components/Pagination";
import SearchComponent from "../../components/SearchComponent";
import PageLayout from "../../components/layout/PageLayout";
import UniverseListItem from "../../components/pageComponent/universe/UniverseListItem";
import { GoPlusCircle } from "react-icons/go";
import CategorySelect from "../../components/pageComponent/universe/CategorySelect";
import { AOO_COLOR } from "../../constants/color";
import UniverseThumbnailEdit from "../../components/pageComponent/universe/UniverseThumbnailEdit";
import UniverseModal from "../../components/modal/UniverseModal";
import { IoCloudUploadOutline } from "react-icons/io5";
import UniverseCreate from "../../components/pageComponent/universe/UniverseCreate";
import API_CONFIG from "../../config/api";
import { UniverseCategoryOptions } from "../../constants/universeData";

export default function UniverseListPage() {
  const navigate = useNavigate();

  const [universeList, setUniverseList] = useState<Universe[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editThumbnailUniverseId, setEditThumbnailUniverseId] = useState<
    number | null
  >(null);

  const fetchUniverse = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BACK_API}/universes?page=${currentPage}&size=${size}`
      );
      const { universes, pagination } = await response.json();
      // const response = UNIVERSE_DATA;
      // const universes = response.universes;
      // const pagination = response.pagination;

      setUniverseList(universes);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalElements);
      setSize(pagination.size);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  function handleOpenEditThumbnail(id: number) {
    setEditThumbnailUniverseId(id);
  }

  function handleCloseModal() {
    fetchUniverse();
    setEditThumbnailUniverseId(null);
  }

  useEffect(() => {
    fetchUniverse();
  }, [currentPage]);

  const onEdit = (id: number) => {
    var uni = universeList.find((x) => x.id == id);

    console.log(id + " Edit");
    console.log(uni);
    
    navigate(`/universe/edit/${id}`);
  };

  function closeCreateModal(): void {
    setShowCreateModal(false);
    fetchUniverse();
  }

  return (
    <PageLayout>
      <section className="w-full mx-8 py-10 md:py-20 sm:w-[90%] md:w-[90%] lg:w-[70%] ">
        <div className="flex flex-col lg:flex-row lg:items-center lg:pb-3 justify-between">
          <div className="flex items-center space-x-5 mb-3">
            <h1 className="font-bold text-base lg:text-lg">
              아・오・옹의 유니버스{" "}
              {totalItems !== 0 && ` ・  ${totalItems} 개`}
            </h1>

            {/* 유니버스 생성 */}
            <div>
              <GoPlusCircle
                size={23}
                className={`cursor-pointer hover:text-[${AOO_COLOR.Orange}]`}
                onClick={() => setShowCreateModal(true)}
              />
            </div>
          </div>

          {/* 카테고리 선택 & 검색 */}
          <div className="flex items-center mb-3">
            <CategorySelect
              onSearch={() => {}}
              options={UniverseCategoryOptions}
            />
            <SearchComponent onSearch={() => {}} options={universeOptions} />
          </div>
        </div>

        {/* 유니버스 리스트 */}
        <div className="flex items-center flex-col lg:py-4">
          <GridHeader headerTitles={universeListHeaderTitles} />
          {universeList.length === 0 && (
            <div className="py-10 ">유니버스가 존재하지 않습니다.</div>
          )}
          {universeList && (
            <ul className="w-full flex flex-col gap-5 ">
              {universeList.map((universe, index) => {
                return (
                  <UniverseListItem
                    key={universe.id}
                    universe={universe}
                    onDelete={(id: number) => {
                      console.log(id + " Delete");
                    }}
                    onEdit={onEdit}
                    onEditThumbnail={() =>
                      handleOpenEditThumbnail(universe.id!)
                    }
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

      {editThumbnailUniverseId !== null && (
        <UniverseModal
          onClose={handleCloseModal}
          title="이미지 업로드"
          description="유니버스에 적용할 새로운 썸네일을 등록하세요."
          icon={<IoCloudUploadOutline size={20} />}
          bgColor="white"
        >
          <UniverseThumbnailEdit
            universeId={editThumbnailUniverseId}
            onClose={handleCloseModal}
          />
        </UniverseModal>
      )}

      {showCreateModal && (
        <UniverseModal
          onClose={() => setShowCreateModal(false)}
          title="유니버스 생성"
          description="새로운 유니버스를 생성합니다."
          icon={<IoCloudUploadOutline size={20} />}
          bgColor="white"
        >
          <UniverseCreate onClose={closeCreateModal} />
        </UniverseModal>
      )}
    </PageLayout>
  );
}
