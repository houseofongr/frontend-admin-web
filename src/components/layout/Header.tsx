import Logo from "./Logo";
import Navigator from "./Navigator";

export default function Header() {
  return (
    <header className="w-full flex md:flex-col flex-row justify-center items-center gap-3 md:justify-between fixed  inset-x-0 md:py-8 sm:py-2 border-b-[1px] border-slate-200 bg-transparent z-10 ">
      <Logo />
      <Navigator />
    </header>
  );
}
