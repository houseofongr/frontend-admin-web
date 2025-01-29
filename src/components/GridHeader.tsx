type HeaderProps = {
  headerTitles: List[];
};
type List = {
  name: string;
  width: string;
};

export default function GridHeader({ headerTitles }: HeaderProps) {
  const gridTemplate = headerTitles.map((item) => item.width).join(" ");

  return (
    <ul className="w-full grid py-2 invisible md:visible" style={{ gridTemplateColumns: gridTemplate }}>
      {headerTitles.map((item) => (
        <li key={item.name} className="pt-5 flex items-center gap-2  justify-center">
          {item.name}
        </li>
      ))}
    </ul>
  );
}
