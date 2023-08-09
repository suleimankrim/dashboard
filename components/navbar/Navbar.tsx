import { auth, UserButton } from "@clerk/nextjs";
import MainNave from "@/components/navbar/MainNave";
import { ComboBox } from "@/components/navbar/ComboBox";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface NavbarProps {}

const Navbar = async () => {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
  const stores = await db.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="h-16 border w-full flex items-center p-2">
      <ComboBox stores={stores} />
      <div className="flex-grow flex justify-center">
        <MainNave />
      </div>
      <div className="flex items-center ml-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};
export default Navbar;
