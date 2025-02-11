import InitHouseImage from "../components/InitHouseImage";
import InitText from "../components/InitText";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-screen flex-center">
      <main className="flex-col flex-center ">
        <InitText />
        {/* todo : 하우스 이미지 클릭 시 로그인 여부에 따라 페이지 이동 분기 처리 필요 */}
        <Link to="/login">
          <InitHouseImage />
        </Link>
      </main>
    </div>
  );
}
