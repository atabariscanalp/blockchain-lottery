import React from "react";

type Props = {
  title: string
}

export const HistoryDetails: React.FC<Props> = ({ children, title }) => {

  return (
    <div
      className="bg-blue-fade rounded-lg flex flex-col px-4 pt-6 pb-3 items-center justify-between"
      style={{ width: "26%" }}
    >
      <div className="flex flex-col items-center">
        <p className="text-honeydew font-bold text-2xl mb-4">
          {title}
        </p>
        {children}
      </div>
      <div className="flex flex-row items-center justify-around self-end justify-self-end w-1/2 px-1">
        <span className="text-grey-fade text-sm font-semibold cursor-pointer">
          TODAY
        </span>
        <span className="font-bold text-rich-black">|</span>
        <span className="text-honeydew text-sm font-bold cursor-pointer">
          ALL TIME
        </span>
      </div>
    </div>
  )
}
