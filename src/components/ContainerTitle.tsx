type Props = {
  stepText: string;
  headingText: string;
};
export default function ContainerTitle({ stepText, headingText }: Props) {
  return (
    <div className="flex items-center text-[#5e4848] py-3">
      <span className="pr-2">{stepText} </span>
      <span className="border border-r-1 border-[#5e4848] h-4 "></span>
      <h2 className="pl-2">{headingText}</h2>
    </div>
  );
}
