"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import Link from "next/link";

const links = [
  { key: "home", href: "/dashboard", icon: HomeIcon },
  {
    key: "invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  {
    key: "customers",
    href: "/dashboard/customers",
    icon: UserGroupIcon,
  },
  {
    key: "upload",
    href: "/dashboard/upload",
    icon: UserGroupIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.key}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{t(link.key)}</p>
          </Link>
        );
      })}
    </>
  );
}