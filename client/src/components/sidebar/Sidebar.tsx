import { MemoizedSidebarIcon as SidebarIcon } from './Sidebar.Icon'
import React from 'react'

const Sidebar = () => {
  return (
    <div
      className={
        'h-screen border-r-blue-light border-r-thin px-8 flex flex-col items-center justify-center'
      }
    >
      <SidebarIcon index={0} />
      <SidebarIcon index={1} />
      <SidebarIcon index={2} />
      <SidebarIcon index={3} />
      <SidebarIcon index={4} />
    </div>
  )
}

export const MemoizedSidebar = React.memo(Sidebar)
