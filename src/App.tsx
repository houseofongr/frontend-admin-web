import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ImageProvider } from "./context/ImageContext";
import { RoomProvider } from "./context/RoomsContext";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import HouseList from "./pages/House/Houses";
import HouseEditorPage from "./pages/House/HouseEditor";
import HouseDetail from "./pages/House/HouseDetail";
import RoomDetail from "./pages/House/RoomDetail";
import UserList from "./pages/User/UserList";
import UserHomeList from "./pages/User/UserHomeList";
import UserHomeDetail from "./pages/User/UserHomeDetail";
import SoundSource from "./pages/SoundSource";
import UserRoomDetail from "./pages/User/UserRoomDetail";

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 관리자 하우스 관련 페이지 */}
          <Route path="/houses" element={<HouseList />} />
          <Route
            path="/houses/house-editor"
            element={
              <ImageProvider>
                <HouseEditorPage />
              </ImageProvider>
            }
          />
          <Route
            path="/houses/:houseId"
            element={
              <RoomProvider>
                <HouseDetail />
              </RoomProvider>
            }
          />
          <Route
            path="/houses/:houseId/rooms/:roomId"
            element={
              <RoomProvider>
                <RoomDetail />
              </RoomProvider>
            }
          />

          {/* 유저 홈 관련 페이지 */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:userId" element={<UserHomeList />} />
          <Route path="/users/:userId/:homeId" element={<UserHomeDetail />} />

          <Route path="/users/:userId/:homeId/:roomId" element={<UserRoomDetail />} />

          {/* 음원 */}
          <Route path="/sound-source" element={<SoundSource />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
