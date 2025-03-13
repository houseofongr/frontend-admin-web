import { FaMobileRetro } from "react-icons/fa6";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaUserLock, FaCheck } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useLocation } from "react-router-dom";

const STEPS = [
  {
    stage: "1st Step",
    detail: "아이디와 비밀번호를 통한 어드민 인증",
    path: "/login",
    icon: <FaUserLock size={20} color="gray" />,
  },
  {
    stage: "2nd Step",
    detail: "카카오 로그인을 통한 어드민 인증",
    path: "/login/2nd",
    icon: <RiKakaoTalkFill color="gray" size={24} />,
  },
  {
    stage: "3rd Step",
    detail: "OTP (일회용 인증 번호)를 통한 어드민 인증",
    path: "/login/3rd",
    icon: <FaMobileRetro color="gray" size={20} />,
  },
];

export default function StepIndicator() {
  const location = useLocation();
  const currentPath = location.pathname;

  const currentStep = STEPS.findIndex((step) => step.path === currentPath);
  return (
    <ol className="hidden md:flex w-[23%] h-[40%] flex-col justify-between text-gray-200 border-s absolute left-20 md:ml-0 lg:ml-10">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <li key={index} className="pl-3 md:pl-8 flex flex-col justify-center relative">
            <span
              className={`absolute flex items-center justify-center w-10 h-10 ${
                isCompleted ? "bg-[#b7e8c3]" : "bg-gray-100"
              } rounded-full -left-5 ring-10 ring-white`}
            >
              {isCompleted ? <FaCheck size={18} color="#00b569" /> : step.icon}
            </span>

            <div className="flex">
              <span className={`text-gray-600 `}>{step.stage}</span>

              {isCurrent && <GoDotFill color="red" size={10} className="ml-1" />}
            </div>

            <p className="text-sm text-gray-500 font-extralight">{step.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}

// <ol className="w-[23%] h-[40%] flex flex-col justify-between  text-gray-200 border-s absolute left-20  md:ml-0 lg:ml-10 ">
//   <li className="pl-3 md:pl-8 flex flex-col justify-center">
//     <span className="absolute flex items-center justify-center w-10 h-10 bg-neutral-100 rounded-full -start-5 ring-10 ring-white">
//       <FaUserLock size={20} color="gray" />
//       {/* 검증 완료 시 보여줄 체크 아이콘 */}
//       {/* <FaCheck size={18} color="#3baa60" /> */}
//     </span>
//     <div className="flex">
//       <span className=" text-gray-600">{STEPS[0].stage}</span>
//       {/* 현재 cur path === STEPS의 path 와 같을 경우 표시 (현재의 스탭이 어딘지 알려주기위함) */}
//       {/* <GoDotFill color="red" size={10} /> */}
//     </div>

//     <p className="text-sm text-gray-500 font-extralight">{STEPS[0].detail}</p>
//   </li>
//   <li className="pl-3 md:pl-8 flex flex-col justify-center">
//     <span className="absolute flex items-center justify-center w-10 h-10  bg-gray-100 rounded-full -start-5 ring-10 ring-white dark:ring-gray-900 dark:bg-gray-700">
//       <RiKakaoTalkFill color="gray" size={24} />
//     </span>

//     <div className="flex">
//       <span className=" text-gray-600">{STEPS[1].stage}</span>
//       {/* <GoDotFill color="red" size={10} /> */}
//     </div>

//     <p className="text-sm text-gray-500 font-extralight">{STEPS[1].detail}</p>
//   </li>

//   <li className="pl-3 md:pl-8 md:pl-8flex flex-col justify-center ">
//     <span className="absolute flex items-center justify-center w-10 h-10  bg-gray-100 rounded-full -start-5 ring-10 ring-white dark:ring-gray-900 dark:bg-gray-700">
//       <FaMobileRetro color="gray" size={20} />
//     </span>
//     <div className="flex">
//       <span className=" text-gray-600">{STEPS[2].stage}</span>
//       {/* <GoDotFill color="red" size={10} /> */}
//     </div>
//     <p className="text-sm text-gray-500 font-extralight">{STEPS[2].detail}</p>
//   </li>
// </ol>
