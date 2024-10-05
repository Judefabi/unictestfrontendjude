"use client";
import Header from "@/components/Header/header";
import Sidebar from "@/components/Sidebar/sidebar";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // this page defines the layout of our dashboard so that we can have a sticky header across the entire page, a sticky sidebar and thus have he content area and sidebar moving idnepently based on user inetrcations
    <section className="flex-col flex h-screen w-full">
      <Header />
      <div className="flex flex-row h-full w-full">
        <Sidebar />
        <div className="flex flex-col w-full h-full overflow-hidden">
          <ContentWrapper>{children}</ContentWrapper>
        </div>
      </div>
    </section>
  );
}
