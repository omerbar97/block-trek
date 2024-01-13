'use client';
import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar.component";
import DimmedOverlay from "@/components/shared/dimmerloading.component";
import { WalletProvider } from "@/hooks/wallet.hook";

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();

  if (session.status == 'unauthenticated') {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  if (session.status == 'loading') {
    // Display loading screen
    return (
      <WalletProvider>
        <div className="flex h-screen flex-col bg-secondImg bg-cover">
          <DimmedOverlay loading={true} />
          <div className="w-full flex-none pl-6 pr-6 pt-3 pb-3">
            <Sidebar />
          </div>
          <div className="flex-grow md:overflow-y-auto text-white bg-secondImg bg-repeat-y">
            {children}
          </div>
        </div>
      </WalletProvider>
    );
  }

  // Display content after loading
  return (
    <WalletProvider>
      <div className="flex h-screen flex-col bg-secondImg bg-cover">
        <div className="w-full flex-none pl-6 pr-6 pt-3 pb-3">
          <Sidebar />
        </div>
        <div className="flex-grow md:overflow-y-auto text-white bg-secondImg bg-repeat-y">
          {children}
        </div>
      </div>
    </WalletProvider>
  );
}
