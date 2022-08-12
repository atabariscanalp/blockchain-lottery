import { SidebarIcon } from "./Sidebar.Icon";

// fixed left-0 top-0 h-screen border-r-blue-light border-r-thin px-8 flex flex-col items-center justify-center

export const Sidebar = () => {
  return (
    <div
      className={
        "h-screen border-r-blue-light border-r-thin px-8 flex flex-col items-center justify-center"
      }
    >
      <SidebarIcon index={0} />
      <SidebarIcon index={1} />
      <SidebarIcon index={2} />
      <SidebarIcon index={3} />
      <SidebarIcon index={4} />
    </div>
  );
};
