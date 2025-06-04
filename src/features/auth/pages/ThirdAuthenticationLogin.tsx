// import StepIndicator from "../../components/StepIndicator";

import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../../../constants/size";

export default function ThirdAuthenticationLogin() {
  return (
    <div
      className="flex-center flex-col md:pb-20"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)` }}
    >
      {/* <StepIndicator /> */}
      3차 어드민 검증 페이지 준비중
    </div>
  );
}
