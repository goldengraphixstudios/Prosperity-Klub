import type { Metadata } from "next";
import PkCmsAdminApp from "@/components/PkCmsAdminApp";

export const metadata: Metadata = {
  title: "Prosperity Klub Content Manager",
  description: "Content manager for Prosperity Klub blog articles.",
  robots: { index: false, follow: false },
};

export default function CmsPage() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <section className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <PkCmsAdminApp />
      </section>
    </main>
  );
}
