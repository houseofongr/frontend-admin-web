type NotepadProps = {
  name: string;
  description: string;
  updatedDate: string;
};

export default function NotePadContent({ name, description, updatedDate }: NotepadProps) {
  return (
    <section className="flex justify-center items-center w-1/2">
      <div
        className="bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/notepad/notepad_v6.png")',
          width: "90%",
          aspectRatio: "6.2/7",
        }}
      />

      <div className="absolute ml-5 mt-35 px-15 text-gray-700 w-1/2 ">
        <div className="h-full flex flex-col pr-15">
          <h2 className="text-4xl pt-10 mb-1 text-start" style={{ fontFamily: "SangSangShinb7" }}>
            {name}
          </h2>
          <p className="leading-tight break-words text-2xl " style={{ fontFamily: "SangSangShinb7" }}>
            {description}
          </p>
          <span className="text-2xl text-end" style={{ fontFamily: "SangSangShinb7" }}>
            {updatedDate}
          </span>
        </div>
      </div>
    </section>
  );
}
