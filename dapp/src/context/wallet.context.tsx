import { createContext } from 'react';

interface WalletContextProps {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  ethValue: string | null;
  setEthValue: (value: string | null) => void;
}

const WalletContext = createContext<WalletContextProps | null>(null);

export { WalletContext };
