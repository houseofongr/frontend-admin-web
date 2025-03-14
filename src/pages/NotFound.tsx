import { Link } from "react-router-dom";
import InitHouseImage from "../components/InitHouseImage";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../constants/size";

export default function NotFoundPage() {
  return (
    <div
      className=" flex flex-col flex-center lg:flex-row gap-10 lg:gap-15  md:text-left md:pb-20 lg:pb-10"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)` }}
    >
      <div>
        <div className="text-7xl md:text-8xl font-bold mb-2 text-center lg:text-start">404</div>
        <p className="text-[15px] md:text-lg pb-5 font-extralight text-center">
          죄송합니다. 현재 찾을 수 없는 페이지를 요청하셨습니다.
        </p>
        <div className="text-center lg:text-start">
          <p className="text-sm md:text-base font-extralight">페이지의 주소가 잘못 입력되었거나,</p>
          <p className="text-sm md:text-base font-extralight">
            주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
          </p>
        </div>
      </div>

      <Link to="/">
        <InitHouseImage />
        <span className="text-xs block mt-2 text-center">홈으로 이동</span>
      </Link>
    </div>
  );
}
