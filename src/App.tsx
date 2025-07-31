import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ImageProvider } from "./context/ImageContext";
import { RoomProvider } from "./context/RoomsContext";
import RootLayout from "./components/layout/RootLayout";
import HouseList from "./features/house/pages/Houses";
import HouseEditorPage from "./features/house/pages/HouseEditor";
import HouseDetail from "./features/house/pages/HouseDetail";
import RoomDetail from "./features/house/pages/RoomDetail";
import UserList from "./features/user/pages/UserList";
import UserHomeList from "./features/user/pages/UserHomeList";
import UserHomeDetail from "./features/user/pages/UserHomeDetail";
import SoundSources from "./features/sound/pages/SoundSources";
import FirstAuthenticationLogin from "./features/auth/pages/FirstAuthenticationLogin";
import SecondAuthenticationLogin from "./features/auth/pages/SecondAuthenticationLogin";
import ThirdAuthenticationLogin from "./features/auth/pages/ThirdAuthenticationLogin";
import NotFoundPage from "./pages/NotFound";
import InitPage from "./pages/Init";
import UserRoomItemEditorPage from "./features/user/pages/UserRoomItemEditor";
import UniverseListPage from "./features/universe/pages/UniverseListPage";
import UniverseEditPage from "./features/universe/pages/UniverseEditPage";
import TestPage from "./pages/test";

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<InitPage />} />
          {/* 어드민 검증 페이지 */}
          <Route path="/login" element={<FirstAuthenticationLogin />} />
          <Route path="/login/2nd" element={<SecondAuthenticationLogin />} />
          <Route path="/login/3rd" element={<ThirdAuthenticationLogin />} />
          {/* 하우스 템플릿 리스트 */}
          <Route path="/houses" element={<HouseList />} />
          {/* 템플릿 하우스 생성 */}
          <Route
            path="/houses/house-editor"
            element={
              <ImageProvider>
                <HouseEditorPage />
              </ImageProvider>
            }
          />
          {/* 템플릿 하우스 상세 */}
          <Route
            path="/houses/:houseId"
            element={
              <RoomProvider>
                <HouseDetail />
              </RoomProvider>
            }
          />
          {/* 템플릿 방 상세  */}
          <Route
            path="/houses/:houseId/rooms/:roomId"
            element={
              <RoomProvider>
                <RoomDetail />
              </RoomProvider>
            }
          />
          {/* 전체 음원 목록 및 경로  */}
          <Route path="/sound-sources" element={<SoundSources />} />
          {/* 유저 목록 */}
          <Route path="/users" element={<UserList />} />
          {/* 유저가 보유한 홈 목록 + 홈 할당 */}
          <Route path="/users/:userId" element={<UserHomeList />} />
          {/* 유저 홈 상세 */}
          <Route path="/users/:userId/:homeId" element={<UserHomeDetail />} />
          {/* 유저 룸 상세 + 아이템 누끼 + 음원 등록 관련 페이지 */}
          <Route
            path="/users/:userId/:homeId/:roomId"
            element={<UserRoomItemEditorPage />}
          />
          {/* 유니버스 메인화면 */}
          <Route path="/universe" element={<UniverseListPage />} />
          {/* 유니버스 수정화면 */}
          <Route
            path="/universe/edit/:universeId"
            element={<UniverseEditPage />}
          />
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

          {/* TEST */}
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
