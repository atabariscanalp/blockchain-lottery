import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

const sizeClassnames = {
  large: "py-3 px-6 font-bold rounded-lg",
  medium: "py-2 px-2 text-base rounded",
  small: "py-1 px-1 text-xs rounded",
};

const colorClassnames = {
  primary:
    "bg-honeydew font-bold rounded-lg text-rich-black disabled:bg-opacity-30",
  secondary: "",
  outline:
    "bg-transparent text-blue-lightest border-blue-lightest border disabled:text-opacity-30 disabled:border-opacity-30",
};

const iconClassname = "flex flex-row items-center justify-around";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  color?: keyof typeof colorClassnames;
  loading?: boolean;
  icon?: JSX.Element;
  rightIcon?: JSX.Element;
  classNameOverride?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "large",
  color = "primary",
  disabled = false,
  icon,
  rightIcon,
  classNameOverride,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`${sizeClassnames[size]} ${colorClassnames[color]} ${
        icon ? iconClassname : null
      } cursor-pointer ${classNameOverride} disabled:cursor-default `}
      {...props}
    >
      {icon}
      {children}
      {rightIcon}
    </button>
  );
};
