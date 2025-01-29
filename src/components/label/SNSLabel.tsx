import clsx from "clsx";
import { FcGoogle } from "react-icons/fc";

type LabelProp = {
  sns: "KAKAO" | "NAVER" | "GOOGLE" | "APPLE";
};

const snsLabels: Record<LabelProp["sns"], string | React.ReactNode> = {
  KAKAO: "K",
  NAVER: "N",
  GOOGLE: <FcGoogle size={10} />,
  APPLE: "A",
};

const snsColors: Record<LabelProp["sns"], string> = {
  KAKAO: "text-yellow-400",
  NAVER: "text-green-600",
  GOOGLE: "text-red-500",
  APPLE: "text-black",
};

export default function SNSLabel({ sns }: LabelProp) {
  return (
    <div
      className={clsx(
        "text-xs font-bold rounded-full px-[7px] bg-white border-zinc-200 border flex-center",
        snsColors[sns]
      )}
    >
      {snsLabels[sns]}
    </div>
  );
}
