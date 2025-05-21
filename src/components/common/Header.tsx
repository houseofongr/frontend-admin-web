import Logo from "./Logo";
import Navigator from "./Navigator";

export default function Header() {
  return (
    <header className="w-full flex md:flex-col flex-row justify-center items-center gap-3 md:justify-between sticky top-0 bg-white z-10 md:py-8 sm:py-2 border-b-[1px] border-slate-200 bg-">
      <Logo />
      <Navigator />
    </header>
  );
}
