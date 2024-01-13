import { createContext } from 'react';

interface WalletContextProps {
  walletAddress: string | null;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>;
  ethValue: string | null;
  setEthValue: React.Dispatch<React.SetStateAction<string | null>>;
}

const WalletContext = createContext<WalletContextProps | null>(null);

export { WalletContext };
