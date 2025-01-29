import { BrowserRouter, Route, Routes } from "react-router-dom";
import SoundSource from "./pages/SoundSource";
import LoginPage from "./pages/Login";
import Home from "./pages/Home";
import RootLayout from "./components/layout/RootLayout";
import HouseEditorPage from "./pages/House/HouseEditor";
import HouseDetail from "./pages/House/HouseDetail";
import { ImageProvider } from "./context/ImageContext";
import { RoomProvider } from "./context/RoomsContext";
import UserList from "./pages/User/UserList";
import UserHomeList from "./pages/User/UserHomeList";
import UserHomeDetail from "./pages/User/UserHomeDetail";
import UserRoomDetail from "./pages/User/UserRoomDetail";
import HouseList from "./pages/House/Houses";
import RoomDetail from "./pages/House/RoomDetail";

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 관리자 하우스  */}
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

          {/* 유저  */}
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
