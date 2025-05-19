import { Link, useLocation } from "react-router-dom";

const TABS = [
  { label: "음원", href: "/sound-sources" },
  { label: "사용자", href: "/users" },
  { label: "하우스", href: "/houses" },
  { label: "유니버스", href: "/universe" },
];

const Navigator = () => {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <nav className="md:pt-0 lg:pt-10 w-full flex justify-end md:justify-center text-xs md:text-sm">
      <ul className="flex gap-5 lg:gap-16 pr-4 md:pr-0">
        {TABS.map(({ label, href }) => {
          const isActive = pathName === href;
          return (
            <li key={label}>
              <Link to={href} className={`${isActive ? " font-semibold" : ""} hover:text-slate-600`}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigator;
