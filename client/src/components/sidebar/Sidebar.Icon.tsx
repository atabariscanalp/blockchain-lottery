import React from "react";
import {
  DuelIcon,
  DuelIconInactive,
  FAQIcon,
  FAQIconInactive,
  HistoryIcon,
  HistoryIconInactive,
  HomeIcon,
  HomeIconInactive,
  RulesIcon,
  RulesIconInactive,
} from "../../icons/Icons.svg";
import { NavLink } from "react-router-dom";

type Props = {
  index: number;
};

type Icons = {
  [key: string]: Record<string, JSX.Element>;
};

const iconIndex: Icons = {
  0: {
    0: <HomeIconInactive width={24} height={24} />,
    1: <HomeIcon width={24} height={24} />,
  },
  1: {
    0: <DuelIconInactive width={24} height={24} />,
    1: <DuelIcon width={24} height={24} />,
  },
  2: {
    0: <HistoryIconInactive width={24} height={24} />,
    1: <HistoryIcon width={24} height={24} />,
  },
  3: {
    0: <RulesIconInactive width={24} height={24} />,
    1: <RulesIcon width={24} height={24} />,
  },
  4: {
    0: <FAQIconInactive width={24} height={24} />,
    1: <FAQIcon width={24} height={24} />,
  },
};

const pageIndex: Record<number, string> = {
  0: "/",
  1: "/duel",
  2: "/history",
  3: "/rules",
  4: "/faq",
};

export const SidebarIcon: React.FC<Props> = ({ index }) => {
  return (
    <NavLink
      className={({ isActive }) =>
        `${
          isActive ? "bg-blue-fade" : "bg-transparent"
        } p-3 rounded-lg flex items-center justify-center mb-7 cursor-pointer`
      }
      to={pageIndex[index]}
    >
      {({ isActive }) => iconIndex[index][Number(isActive)]}
    </NavLink>
  );
};
