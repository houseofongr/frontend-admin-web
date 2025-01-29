import CircleIcon from "../icons/CircleIcon";

type FileUploadButtonProp = {
  htmlFor: string;
  disabled?: boolean;
};

export default function FileUploadButton({ htmlFor }: FileUploadButtonProp) {
  return (
    <label htmlFor={htmlFor} className="cursor-pointer mt-4 disabled:cursor-not-allowed">
      <CircleIcon icon={<span>+</span>} text="파일 업로드" />
    </label>
  );
}
