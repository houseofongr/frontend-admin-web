import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ImageProvider } from "./context/ImageContext";
import { RoomProvider } from "./context/RoomsContext";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home";
import HouseList from "./pages/House/Houses";
import HouseEditorPage from "./pages/House/HouseEditor";
import HouseDetail from "./pages/House/HouseDetail";
import RoomDetail from "./pages/House/RoomDetail";
import UserList from "./pages/User/UserList";
import UserHomeList from "./pages/User/UserHomeList";
import UserHomeDetail from "./pages/User/UserHomeDetail";
import NewUserRoomDetail from "./pages/User/NewUserRoomDetail";
import SoundSources from "./pages/SoundSources";
import FirstVerificationLogin from "./pages/Login/FirstVerificationLogin";
import SecondVerificationLogin from "./pages/Login/SecondVerificationLogin";
import NotFoundPage from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<FirstVerificationLogin />} />
          <Route path="/login/2nd" element={<SecondVerificationLogin />} />

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

          <Route path="/users" element={<UserList />} />
          <Route path="/users/:userId" element={<UserHomeList />} />
          <Route path="/users/:userId/:homeId" element={<UserHomeDetail />} />

          <Route path="/users/:userId/:homeId/:roomId" element={<NewUserRoomDetail />} />

          <Route path="/sound-sources" element={<SoundSources />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
