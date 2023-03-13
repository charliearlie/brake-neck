import { User } from "@prisma/client";
import { Link } from "@remix-run/react";
import { useState } from "react";
import BurgerSVG from "~/styles/svg/burger";
import CloseSVG from "~/styles/svg/close";
import SearchSVG from "~/styles/svg/search";
import UserDropDown from "./user-dropdown";

type Props = {
  user: User | null;
};

export default function SharedHeader({ user }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navigation = [
    { title: "Supercars", path: "/supercars" },
    { title: "Hypercars", path: "/hypercars" },
    { title: "Racing cars", path: "/racing" },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-gray-800">
      <div className="mx-auto flex max-w-screen-xl items-center space-x-8 py-3 px-4 md:px-8">
        <div className="flex-none lg:flex-initial">
          <Link to="/">
            <span className="text-2xl font-black text-purple-200 md:text-4xl">
              BrakeNeck
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div
            className={`absolute top-16 left-0 z-20 w-full border-b bg-gray-800 p-4 lg:static lg:block lg:border-none ${
              isMenuOpen ? "" : "hidden"
            }`}
          >
            <ul className="mt-12 space-y-5 lg:mt-0 lg:flex lg:space-x-6 lg:space-y-0">
              {navigation.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xl font-bold text-gray-300 hover:text-gray-400"
                >
                  <Link to={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>

            <UserDropDown
              className="mt-5 block border-t bg-gray-800 pt-5 lg:hidden"
              user={user}
            />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-6">
            <form className="flex items-center space-x-2 rounded-md border bg-gray-900 p-2">
              <SearchSVG />
              <input
                className="w-full appearance-none text-gray-300 placeholder-gray-400 outline-none sm:w-auto"
                type="text"
                placeholder="Search"
              />
            </form>
            <UserDropDown className="hidden lg:block" user={user} />
            <button
              className="block text-gray-400 outline-none lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <CloseSVG /> : <BurgerSVG />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}