import React from 'react'

const Logo = () => {
  return (
    <span className="font-bold text-transparent text-4xl bg-clip-text text-white">
      Duelipto
    </span>
  )
}

export const MemoizedLogo = React.memo(Logo)
