import InitHouseImage from "../components/InitHouseImage";
import InitText from "../components/InitText";
import { Link } from "react-router-dom";
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "../constants/size";

export default function InitPage() {
  return (
    <div
      className="flex-center flex-col md:pb-20"
      style={{ minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)` }}
    >
      <main className="flex flex-col items-center">
        <InitText />
        <Link to="/login">
          <InitHouseImage />
        </Link>
      </main>
    </div>
  );
}
