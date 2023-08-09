import { FC } from "react";
import Header from "@/components/ui/Header";

interface PageProps {}

const Page: FC<PageProps> = () => {
  return (
    <div className="p-4">
      <Header
        title={"Welcome"}
        description={"create your dream store"}
      ></Header>
    </div>
  );
};
export default Page;
