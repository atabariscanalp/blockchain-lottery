import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const sizeClassnames = {
  large: "py-3 px-5 font-bold rounded-md",
  medium: "py-2 px-2 text-base rounded",
  small: "py-1 px-1 text-xs rounded",
};

const colorClassnames = {
  primary: "bg-sky-400 border-2 border-transparent font-bold",
  secondary: "",
  outline:
    "bg-transparent text-white border-white border-2 hover:border-blue-300",
};

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  color?: keyof typeof colorClassnames;
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "large",
  color = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled
      className={`${sizeClassnames[size]} ${colorClassnames[color]} text-white cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
};
