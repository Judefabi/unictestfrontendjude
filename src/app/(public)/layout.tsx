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
