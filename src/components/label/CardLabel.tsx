import clsx from "clsx";

type LabelProp = {
  text: string;
  hasBorder?: boolean;
  hasPadding?: boolean;
  size?: "default" | "large";
  colorType?: "primary" | "notice";
  html?: string;
};

export default function CardLabel({
  text,
  hasBorder = true,
  hasPadding = true,
  size = "default",
  colorType = "primary",
  html,
}: LabelProp) {
  return (
    <label
      htmlFor={html}
      className={clsx(
        // "rounded-sm  bg-white",
        "rounded-sm bg-transparent",

        { "border  ": hasBorder },
        { "py-1 px-2": hasPadding },
        colorType === "primary" && "text-[#F5946D] border-[#F5946D] ",
        colorType === "notice" && "text-[#ff4747] border-[#ff4747]",
        size === "default" && "text-xs ",
        size === "large" && "text-[14px]"
      )}
    >
      {text}
    </label>
  );
}
