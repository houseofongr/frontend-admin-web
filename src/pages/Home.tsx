import InitHouseImage from "../components/InitHouseImage";
import InitText from "../components/InitText";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-screen flex-center">
      <main className="flex-col flex-center ">
        <InitText />
        <Link to="/login">
          <InitHouseImage />
        </Link>
      </main>
    </div>
  );
}
