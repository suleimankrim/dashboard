"use client";
import { FC } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MainNavProps {}

const MainNave: FC<MainNavProps> = () => {
  const pathName = usePathname();
  const params = useParams();
  const route = [
    {
      href: `/${params.storeId}/billboards`,
      label: "billboards",
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "categories",
      active: pathName === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "sizes",
      active: pathName === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "colors",
      active: pathName === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "products",
      active: pathName === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "orders",
      active: pathName === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "settings",
      active: pathName === `/${params.storeId}/settings`,
    },
  ];
  return (
    <nav className="flex items-center justify-around w-full max-w-[700px]">
      {route.map((value) => (
        <Link
          key={value.href}
          href={value.href}
          className={cn(
            "ml-2 text-sm text-gray-500 hover:text-black hover:font-bold",
            value.active ? "text-black font-bold" : ""
          )}
        >
          {value.label}
        </Link>
      ))}
    </nav>
  );
};
export default MainNave;
