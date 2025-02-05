import clsx from "clsx";
import { ScaleLoader } from "react-spinners";

type SpinnerIconProp = {
  usage?: "icon" | "page";
};
export default function SpinnerIcon({ usage = "page" }: SpinnerIconProp) {
  const isPage = usage === "page";
  return (
    <div className={clsx("flex-center", isPage ? "fixed inset-0 z-50" : "w-12 h-12")}>
      <ScaleLoader width={2} height={40} color="#F5946D" />
    </div>
  );
}
