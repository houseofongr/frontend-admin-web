import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./Header";
import Footer from "./Footer";

const HIDE_LAYOUT_PATHS = ["/houses/house-editor"]; // 헤더/푸터를 숨길 고정 경로

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [queryClient] = useState(() => new QueryClient());

  const currentPath = location.pathname;

  // 유저 홈 디테일 페이지 및 유저 룸 디테일 페이지 감지
  const isUserHomeDetailPage = /^\/users\/[^/]+\/[^/]+$/.test(currentPath); // /users/:userId/:homeId
  const isUserRoomDetailPage = /^\/users\/[^/]+\/[^/]+\/[^/]+$/.test(currentPath); // /users/:userId/:homeId/:roomId

  // 하우스 상세 페이지 감지 (/houses/:houseId)
  const isHouseDetailPage = /^\/houses\/[^/]+$/.test(currentPath);
  // 하우스 룸 상세 페이지 감지 (예: /houses/:houseId/rooms/:roomId)
  const isRoomDetailPage = /^\/houses\/[^/]+\/rooms\/[^/]+$/.test(currentPath);

  // 특정 경로에서 헤더/푸터 숨기기
  const shouldHideLayout =
    HIDE_LAYOUT_PATHS.includes(currentPath) ||
    isHouseDetailPage ||
    isRoomDetailPage ||
    isUserHomeDetailPage ||
    isUserRoomDetailPage;

  return (
    <div>
      {!shouldHideLayout && <Header />}
      <QueryClientProvider client={queryClient}>
        <main className="w-full h-screen overflow-auto pb-5">{children}</main>
      </QueryClientProvider>

      {!shouldHideLayout && <Footer />}
    </div>
  );
}
