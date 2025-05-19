import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ImageProvider } from "./context/ImageContext";
import { RoomProvider } from "./context/RoomsContext";
import RootLayout from "./components/layout/RootLayout";
import HouseList from "./pages/House/Houses";
import HouseEditorPage from "./pages/House/HouseEditor";
import HouseDetail from "./pages/House/HouseDetail";
import RoomDetail from "./pages/House/RoomDetail";
import UserList from "./pages/User/UserList";
import UserHomeList from "./pages/User/UserHomeList";
import UserHomeDetail from "./pages/User/UserHomeDetail";
import SoundSources from "./pages/Sound/SoundSources";
import FirstAuthenticationLogin from "./pages/Login/FirstAuthenticationLogin";
import SecondAuthenticationLogin from "./pages/Login/SecondAuthenticationLogin";
import ThirdAuthenticationLogin from "./pages/Login/ThirdAuthenticationLogin";
import NotFoundPage from "./pages/NotFound";
import InitPage from "./pages/Init";
import UserRoomItemEditorPage from "./pages/User/UserRoomItemEditor";
import UniverseList from "./pages/Universe/UniverseList";

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
          <Route path="/universe" element={<UniverseList />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
