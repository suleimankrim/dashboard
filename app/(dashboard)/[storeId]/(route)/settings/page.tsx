import SettingForm from "@/app/(dashboard)/[storeId]/(route)/settings/components/SettingForm";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface settingProps {
  params: {
    storeId: string;
  };
}

const setting = async ({ params }: settingProps) => {
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  });
  if (!store) return redirect("/");
  return (
    <>
      <SettingForm store={store} />
    </>
  );
};
export default setting;
