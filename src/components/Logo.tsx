import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to={"/"} className="flex flex-col items-center md:flex-row gap-2 p-5 cursor-pointer">
      <img src={"/images/logo/logo_type_face_bold.png"} alt="archive of ongr logo type face" width={180} height={20} />
    </Link>
  );
}
