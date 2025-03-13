import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../../constants/size";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full flex items-center flex-col"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)` }}
    >
      {children}
    </div>
  );
}
