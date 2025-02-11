import API_CONFIG from "../../config/api";
import { FaRegSquareCheck } from "react-icons/fa6";
import { FaRegSquare } from "react-icons/fa6";

export default function SecondVerificationLogin() {
  const handleLogin = async (provider: string) => {
    window.location.href = `${API_CONFIG.BACK_API}/authn/login/${provider}`;
  };
  return (
    <div className="flex flex-col items-center w-full h-full mt-[35%] md:mt-[20%] ">
      {/* 체크리스트 */}
      <ul className=" mb-10 flex flex-col items-start py-10 ">
        <li className="flex-center gap-0.5 bg-green-100 rounded-sm px-2">
          <FaRegSquareCheck size={20} color="#129e51" />
          <p className="text-green-700">아오옹의 관리자 1차 로그인 검증</p>
        </li>
        <li className="flex-center gap-0.5 px-2">
          <FaRegSquare size={20} color="gray" />
          <p className="text-gray-700">아오옹의 관리자 2차 로그인 검증 </p>
        </li>
      </ul>
      <section className="flex-center flex-col">
        <div className="cursor-pointer">
          <img
            onClick={() => handleLogin("kakao")}
            src={"/images/kakaoLoginButton.png"}
            alt="kakaoLoginButton"
            width={200}
            height={100}
          />
        </div>
        <p className="text-sm pt-2 text-stone-500 font-light">2차 검증에 필요한 카카오 로그인을 시도하여 주세요.</p>
      </section>
    </div>
  );
}
