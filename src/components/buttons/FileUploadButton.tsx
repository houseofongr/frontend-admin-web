import clsx from "clsx";
import CircleIcon from "../icons/CircleIcon";

type FileUploadButtonProp = {
  htmlFor: string;
  disabled?: boolean;
  size?: "default" | "small";
};

export default function FileUploadButton({ htmlFor, size = "default" }: FileUploadButtonProp) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "cursor-pointer disabled:cursor-not-allowed",
        size === "default" && "mt-4",
        size === "small" && "text-xs"
      )}
    >
      <CircleIcon icon={<span>+</span>} text="파일 업로드" />
    </label>
  );
}
