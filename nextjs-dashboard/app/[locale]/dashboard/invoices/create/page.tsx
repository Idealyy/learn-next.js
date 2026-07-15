import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const customers = await fetchCustomers();
  const t = await getTranslations("CreateInvoicePage");

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          {
            label: t("invoices"),
            href: "/dashboard/invoices",
          },
          {
            label: t("createInvoice"),
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />

      <Form customers={customers} />
    </main>
  );
}