import React from "react";
import CardLabel from "./label/CardLabel";

type InputFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readOnly: boolean;
  isSingleLine?: boolean;
  id: string;
};

export default function InputField({ label, value, onChange, readOnly, isSingleLine = true, id }: InputFieldProps) {
  return (
    <div className="mb-2">
      <CardLabel html={id} text={label} hasBorder={false} hasPadding={false} />
      {isSingleLine ? (
        <input
          id={id}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full outline-hidden transition-all duration-300   ${
            readOnly ? "" : "px-2 py-1 border border-stone-300"
          }`}
        />
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full outline-hidden transition-all duration-300 ${
            readOnly ? "" : " px-2 py-1 border  border-stone-300"
          }`}
        />
      )}
    </div>
  );
}
