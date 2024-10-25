import Link from "next/link";
import Notification from "./NavBar/Notification";
import Search from "./NavBar/Search";
import SideBar from "./NavBar/SideBar";
import Theme from "./NavBar/Theme";
import Upload from "./NavBar/Upload";
import UserInfo from "./NavBar/UserInfo";

export default function NavBar() {
  return (
    <header className="bg-black sticky top-0 z-10">
      <nav className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center p-4 font-bold max-w-6xl mx-auto text-white">
        <SideBar />
        <h1 className="text-2xl sm:text-3xl text-center whitespace-nowrap">
          <Link href="/">Mom's Image Gallery</Link>
        </h1>
        <Search />
        <Theme />
        <Notification />
        <UserInfo />
        <Upload />
      </nav>
    </header>
  );
}
