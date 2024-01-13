import React, { useState, useContext, ReactNode } from "react";
import { WalletContext } from "@/context/wallet.context";

interface WalletContextChildren {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletContextChildren> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ethValue, setEthValue] = useState<string | null>(null);

  const contextValue = {
    walletAddress,
    setWalletAddress,
    ethValue,
    setEthValue,
  };

  return (
    <WalletContext.Provider value={contextValue} >{children}</WalletContext.Provider>
  )

};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

