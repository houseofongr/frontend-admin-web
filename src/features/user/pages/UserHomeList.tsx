import { useNavigate, useParams } from "react-router-dom";
import { BaseHouse } from "../../../types/house";
import { useEffect, useState } from "react";
import HouseTemplates, { AdminHouse } from "../components/HouseTemplates";
import API_CONFIG from "../../../config/api";
import Modal from "../../../components/modal/Modal";
import HomeCard from "../components/HomeCard";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import ModalAlertMessage, { AlertType } from "../../../components/modal/ModalAlertMessage";
import Button from "../../../components/buttons/Button";
import PageLayout from "../../../components/layout/PageLayout";

interface UserHome {
  id: number;
  name: string;
  createdDate: string;
  updatedDate: string;
  baseHouse: BaseHouse;
  user: { id: number; nickname: string };
}

export default function UserHomeList() {
  const { userId } = useParams<{ userId: string }>();

  const [userHomes, setUserHomes] = useState<UserHome[] | null>(null);
  const [adminHouses, setAdminHouses] = useState<AdminHouse[] | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [homeToDelete, setHomeToDelete] = useState<number | null>(null);
  const [newHomeId, setNewHomeId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ text: string; type: AlertType } | null>(null);

  const showAlert = (text: string, type: AlertType) => {
    setAlert({ text, type });
  };

  const navigate = useNavigate();

  const closeModal = () => {
    setIsOpenModal(false);
    setHomeToDelete(null);
  };

  const fetchUserHomes = async (userId: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/users/${userId}/homes`);
      const data = await response.json();

      setUserHomes(data.homes);
    } catch (error) {
      showAlert(`유저의 홈 목록 데이저 조회에 실패하였습니다. error : ${error}`, "fail");
      console.error("Failed to fetch user homes:", error);
    }
  };

  const getAdminHouseList = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/houses`);
      const { houses } = await response.json();
      // 유저가 가지고 있는 하우스 ID 리스트 추출
      const houseTemplateIds = userHomes ? userHomes.map((home) => home.baseHouse.id) : [];
      const filteredHouses = houses.filter((house: AdminHouse) => !houseTemplateIds.includes(house.id));
      setAdminHouses(filteredHouses);
      setIsOpenModal(true);
    } catch (error) {
      showAlert(`관리자가 가지고 있는 하우스 템플릿 목록 조회에 실패하였습니다. error : ${error}`, "fail");
    }
  };

  // 유저에게 홈 할당
  const registHomeToUsertHandler = async (houseId: number) => {
    // const userId = parseInt(params.userId);
    if (!userId || !houseId) {
      showAlert(`유효하지 않은 유저ID 이거나 하우스ID 입니다.`, "fail");
      return;
    }
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/homes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          houseId,
        }),
      });

      if (!response.ok) {
        let errorMessage = "유저에게 새로운 집 할당에 실패하였습니다.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("JSON 파싱 오류:", jsonError);
        }

        showAlert(errorMessage, "fail");
        return;
      }

      const result = await response.json();
      setNewHomeId(result.createdHomeId);
      fetchUserHomes(userId);
      setIsOpenModal(false);
      showAlert(`해당 유저에게 새로운 집 등록이 완료되었습니다.`, "success");
    } catch (error) {
      showAlert(`유저에게 새로운 홈 할당 오류 발생하였습니다. error: ${error}`, "fail");
    }
  };

  const navigateUserHome = (homeId: number) => {
    if (homeId) {
      const selectedHome = userHomes?.find((home) => home.id === homeId);
      if (selectedHome) {
        localStorage.setItem("houseId", JSON.stringify(selectedHome.baseHouse.id));
      }
      navigate(`/users/${userId}/${homeId}`);
    }
  };

  const homeDeleteHandler = async (homeId: number) => {
    if (!homeToDelete) {
      console.error("No home selected for deletion");
      return;
    }

    if (!userId || !homeId) {
      console.error("Invalid userId or homeId");
      return;
    }
    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/homes/${homeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to assign house to user");
      }
      const { message } = await response.json();
      fetchUserHomes(userId);
      closeModal();
      showAlert(`${message}`, "success");
    } catch (error) {
      showAlert(`유저의 홈 삭제 중 오류가 발생하였습니다. error:${error}`, "fail");
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserHomes(userId);
      localStorage.setItem("userId", JSON.stringify(userId));
    }
  }, [userId]);

  if (!userHomes) return <SpinnerIcon />;
  else {
    return (
      <PageLayout>
        <div className="w-[65%] py-10 md:py-20">
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-lg font-bold">
              {userHomes.length > 0 ? (
                <>
                  {userHomes[0]?.user?.nickname} 님의 집 ({`${userHomes.length}`})
                </>
              ) : (
                ""
              )}
            </h2>
            <Button label="ADD" onClick={getAdminHouseList} />
          </div>

          {userHomes.length === 0 ? (
            <div className="h-[300px] flex-center">해당 유저에게 할당된 집이 존재하지 않습니다.</div>
          ) : (
            <ul className="mt-10 grid grid-cols-2 gap-8">
              {userHomes.map((home) => (
                <HomeCard
                  key={home.id}
                  home={home}
                  isNew={home.id === newHomeId}
                  onNavigate={navigateUserHome}
                  onDelete={setHomeToDelete}
                />
              ))}
            </ul>
          )}
        </div>

        {alert && (
          <ModalAlertMessage
            text={alert.text}
            type={alert.type}
            onClose={() => setAlert(null)}
            okButton={<Button label="확인" onClick={() => setAlert(null)} />}
          />
        )}

        {isOpenModal && adminHouses && (
          <Modal onClose={closeModal} bgColor="white">
            <HouseTemplates adminHouses={adminHouses} registHomeToUsertHandler={registHomeToUsertHandler} />
          </Modal>
        )}

        {homeToDelete && (
          <ModalAlertMessage
            text={`${userHomes[0].user.nickname}의 홈 ID# ${homeToDelete}을 홈 목록에서 삭제하시겠습니까? 등록된 아이템과 음원이 있다면 모두 삭제됩니다.`}
            type="warning"
            okButton={<Button label="확인" onClick={() => homeDeleteHandler(homeToDelete)} />}
            cancelButton={<Button label="취소" onClick={closeModal} />}
            onClose={closeModal}
          />
        )}
      </PageLayout>
    );
  }
}
