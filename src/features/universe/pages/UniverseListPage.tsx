import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Universe } from "../../../types/universe";
import GridHeader from "../../../components/GridHeader";
import { universeListHeaderTitles } from "../../../constants/headerList";
import Pagination from "../../../components/Pagination";
import SearchComponent from "../../../components/SearchComponent";
import PageLayout from "../../../components/layout/PageLayout";
import UniverseListItem from "../components/UniverseListItem";
import { GoPlusCircle } from "react-icons/go";
import CategorySelect from "../components/CategorySelect";
import { AOO_COLOR } from "../../../constants/color";
import IconTitleModal from "../../../components/modal/IconTitleModal";
import { IoCloudUploadOutline } from "react-icons/io5";
import UniverseCreate from "./UniverseCreate";
import API_CONFIG from "../../../config/api";
import ImageUploadModal from "../../../components/modal/ImageUploadModal";
import ModalAlertMessage, {
  AlertType,
} from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";
import { universeSearchOptions } from "../../../constants/searchOptions";
import ThumbMusicPreview from "../components/ThumbMusicPreview";
import { UniverseCategoryOptions } from "../../../constants/UniverseData";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import { useUniverseStore } from "../../../context/useUniverseStore";
import { deleteUniverse, getUniverse, patchUniverseThumbnailEdit } from "../../../service/universeService";
import { ScaleLoader } from "react-spinners";


export default function UniverseListPage() {
  const navigate = useNavigate();
  const {
    resetUniverse
  } = useUniverseStore();

  const [universeList, setUniverseList] = useState<Universe[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchType, setSearchType] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const [totalItems, setTotalItems] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editThumbnailUniverseId, setEditThumbnailUniverseId] = useState<
    number | null
  >(null);

  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(
    null
  );

  const [deleteId, setDeleteId] = useState<number>();
  const [showThumbMusic, setShowThumbMusic] = useState<number>(-1);;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    resetUniverse();
  }, []);

  const fetchUniverse = async (
    page: number = currentPage,
    sizeValue: number = size,
    type: string | null = searchType,
    word: string | null = keyword
  ) => {
    setLoading(true);
    try {
      const data = await getUniverse(page, sizeValue, type, word);

      const { universes, pagination } = data;

      setUniverseList(universes);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalElements);
      setSize(pagination.size);
    } catch (error) {
      console.error("Failed to fetch universes:", error);
    }
    setLoading(false);
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
    resetUniverse();
    navigate(`/universe/edit/${id}`);
  };

  function closeCreateModal(): void {
    setShowCreateModal(false);
    fetchUniverse();
  }

  const closeThumbMusicModal = () => {
    setShowThumbMusic(-1);
  }
  const saveThumbnailHandler = async (file: File) => {
    if (!file) {
      setAlert({
        text: "업로드할 이미지 파일을 선택해주세요.",
        type: "warning",
      });
      return;
    }

    try {
      await patchUniverseThumbnailEdit(editThumbnailUniverseId!, file);

      setAlert({
        text: "썸네일 저장이 완료되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("썸네일 저장 실패:", error);
      setAlert({
        text: "썸네일 저장에 실패했습니다.",
        type: "fail",
      });
    }
  };
  

  const deleteUniverseHandler = async () => {
    try {
      if (deleteId == null) return;

      await deleteUniverse(deleteId);

      setAlert({
        text: "유니버스 삭제가 완료되었습니다.",
        type: "success",
      });
    } catch (error) {
      console.error("유니버스 삭제 실패:", error);
      setAlert({
        text: "유니버스 삭제 실패",
        type: "fail",
      });
    }
  };

  const handleSearch = (type: string, word: string) => {
    setSearchType(type);
    setKeyword(word);
    setCurrentPage(1);
    fetchUniverse(1, size, type, word); //
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUniverse(page, size, searchType, keyword);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setAlert({
      text: "정말로 유니버스를 삭제하시겠습니까?",
      type: "info",
    });
  };

  const handlePlayMusic = (page: number) => { };

  return (
    <PageLayout>
      {alert && alert.type != "info" && (
        <ModalAlertMessage
          text={alert.text}
          type={alert.type}
          onClose={() => {
            setAlert(null);
            handleCloseModal();
          }}
          okButton={
            <Button
              label="확인"
              onClick={() => {
                setAlert(null);
                handleCloseModal();
              }}
            />
          }
        />
      )}
      {alert && alert.type == "info" && (
        <ModalAlertMessage
          text={alert.text}
          subText="* 관련된 이미지와 음원, 내부 스페이스 및 요소가 모두 삭제됩니다."
          type={alert.type}
          onClose={() => {
            setAlert(null);
            handleCloseModal();
          }}
          okButton={
            <Button
              label="확인"
              onClick={() => {
                deleteUniverseHandler();
                setAlert(null);
                handleCloseModal();
              }}
            />
          }
          cancelButton={
            <Button
              variant="gray"
              label="취소"
              onClick={() => {
                setAlert(null);
                handleCloseModal();
              }}
            />
          }
        />
      )}
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
              onSearch={(a, b) => {
                console.log(a, b);
              }}
              options={UniverseCategoryOptions}
            />
            <SearchComponent
              onSearch={handleSearch}
              options={universeSearchOptions}
            />
          </div>
        </div>

        {/* 유니버스 리스트 */}
        <div className="relative flex items-center flex-col lg:py-4 min-h-70">
          <GridHeader headerTitles={universeListHeaderTitles} />
          {loading && (
            <div className="absolute inset-0 z-50 mt-20 flex items-center justify-center">
              <ScaleLoader width={2} height={40} color="#F5946D" />
            </div>
          )}

          {!loading && universeList.length === 0 && (
            <div className="py-10 ">유니버스가 존재하지 않습니다.</div>
          )}
          {universeList && (
            <ul className="w-full flex flex-col gap-5 ">
              {universeList.map((universe) => {
                return (
                  <UniverseListItem
                    key={universe.id}
                    universe={universe}
                    onDelete={handleDelete}
                    onEdit={onEdit}
                    onEditThumbnail={() =>
                      handleOpenEditThumbnail(universe.id!)
                    }
                    onPlayMusic={(id: number) => {
                      setShowThumbMusic(id);
                      console.log(id);
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
            onPageChange={handlePageChange}
          />
        )}
      </section>
      {editThumbnailUniverseId !== null && (
        <ImageUploadModal
          title="유니버스 썸네일 수정"
          description="유니버스에 적용할 새로운 썸네일을 등록하세요."
          labelText="썸네일"
          maxFileSizeMB={5}
          onClose={handleCloseModal}
          onConfirm={(file) => saveThumbnailHandler(file)}
          confirmText="저장"
          requireSquare={true}
        />
      )}
      {showCreateModal && (
        <IconTitleModal
          onClose={() => setShowCreateModal(false)}
          title="유니버스 생성"
          description="새로운 유니버스를 생성합니다."
          icon={<IoCloudUploadOutline size={20} />}
          bgColor="white"
        >
          <UniverseCreate onClose={closeCreateModal} />
        </IconTitleModal>
      )}
      {showThumbMusic != -1 && (
        <IconTitleModal
          onClose={() => setShowThumbMusic(-1)}
          title="썸뮤직 듣기"
          description="썸뮤직 미리 듣기"
          icon={<IoCloudUploadOutline size={20} />}
          bgColor="white"
        >
          <ThumbMusicPreview
            onClose={() => setShowThumbMusic(-1)}
            thumbMusicId={showThumbMusic}
          />
        </IconTitleModal>
      )}
    </PageLayout>
  );
}
