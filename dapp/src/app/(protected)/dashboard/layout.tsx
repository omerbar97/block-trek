'use client';
import React, { useEffect } from "react";
import Sidebar from "@/components/sidebar.component";
import { WalletProvider } from "@/hooks/wallet.hook";
import { SearchbarProvider } from "@/hooks/searchbar.hook";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DimmedOverlay from "@/components/shared/dimmerloading.component";
import { unauthenticatedAccessToast } from "@/utils/toast";

export default function Layout({ children }: { children: React.ReactNode }) {

  const { data: session, status } = useSession()
  console.log(status)
  const router = useRouter()

  const layoutContent = () => {
    return (
      <WalletProvider>
        <SearchbarProvider>
          <div className="flex h-screen flex-col bg-secondImg">
            <div className="w-full flex-none pl-6 pr-6 pt-3 pb-3">
              <Sidebar />
            </div>
            <div className="flex-grow md:overflow-y-auto text-white bg-secondImg">
              {children}
            </div>
          </div>
        </SearchbarProvider>
      </WalletProvider>
    )
  }

  useEffect(() => {
    // Ensure that the toast is displayed only once when unauthenticated
    if (status === 'unauthenticated') {
      unauthenticatedAccessToast();

      // Redirect after 5 seconds
      const timeoutId = setTimeout(() => {
        router.push('/api/auth/signin?callbackUrl=/dashboard');
      }, 5000);

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [status]);

  
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <>
        <DimmedOverlay />
        {layoutContent()}
      </>
    )
  }

  if (status == 'authenticated') {
    // Display content after loading
    return (
      <>
        {layoutContent()}
      </>
    );
  }
}
