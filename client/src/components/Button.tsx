import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const sizeClassnames = {
  large: "py-3 px-6 font-bold rounded-lg",
  medium: "py-2 px-2 text-base rounded",
  small: "py-1 px-1 text-xs rounded",
};

const colorClassnames = {
  primary: "bg-sky-400 border-2 border-transparent font-bold",
  secondary: "",
  outline: "bg-transparent text-blue-lightest border-blue-lightest border",
};

const iconClassname = "flex flex-row items-center justify-around";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  color?: keyof typeof colorClassnames;
  loading?: boolean;
  icon?: any;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "large",
  color = "primary",
  disabled = false,
  className = "",
  icon,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`${sizeClassnames[size]} ${colorClassnames[color]} ${
        icon ? iconClassname : null
      } cursor-pointer`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
