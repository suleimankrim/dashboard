import { FC } from "react";

interface HeaderProps {
  title: string;
  description: string;
}

const Header: FC<HeaderProps> = ({ description, title }: HeaderProps) => {
  return (
    <div>
      <h1 className="font-bold text-xl">{title}</h1>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};
export default Header;
