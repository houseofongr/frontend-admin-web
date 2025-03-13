// import { useEffect } from "react";
import API_CONFIG from "../../config/api";
// import { useNavigate, useSearchParams } from "react-router-dom";
import LoginLayout from "../../components/layout/LoginLayout";
import InitHouseImage from "../../components/InitHouseImage";

export default function SecondAuthenticationLogin() {
  // useSearchParams : 현재 위치에 대한 url 의 쿼리 문자열을 읽고 처리하는데 사용. url의 ? 뒤에 있는 부분은 key-value 구조
  // const [searchParams] = useSearchParams();
  // const navigate = useNavigate();
  const handleLogin = async (provider: string) => {
    window.location.href = `${API_CONFIG.BACK_API}/authn/login/${provider}`;
  };

  // 1차 검증 여부 확인
  // useEffect(() => {
  //   //1차 검증이 안되었으면 로그인 페이지로 이동시키기
  //   if (!searchParams.get("success")) {
  //     navigate("/login");
  //   }
  // }, []);

  // if (!searchParams.get("success")) {
  //   return (
  //     <div className="w-full h-full flex-center flex-col">
  //       <p className="text-red-500">잘못된 접근입니다.</p>
  //     </div>
  //   );
  // }

  return (
    <LoginLayout>
      {/* <StepIndicator /> */}
      <section className="flex flex-col gap-10">
        <InitHouseImage />
        <div className="cursor-pointer">
          <img
            onClick={() => handleLogin("kakao")}
            src={"/images/sns/kakaoLogin.png"}
            alt="kakaoLoginButton"
            width={200}
            height={100}
          />
        </div>
      </section>
    </LoginLayout>
  );
}
