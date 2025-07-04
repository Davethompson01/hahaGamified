
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

// Ensure TypeScript recognizes the ethereum property (MetaMask interface)
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, handler: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const MONAD_TESTNET_CONFIG = {
  chainId: '10143', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'Monad',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com'],
};

const ConnectWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet is already connected
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setAddress(savedAddress);
    }

    // Check if MetaMask is available
    if (typeof window !== 'undefined' && window.ethereum) {
      console.log('MetaMask detected:', window.ethereum.isMetaMask);
    }
  }, []);

  const checkMetaMaskAvailability = () => {
    if (typeof window === 'undefined') {
      return false;
    }

    if (!window.ethereum) {
      console.log('No ethereum object found');
      return false;
    }

    if (!window.ethereum.isMetaMask) {
      console.log('Ethereum object exists but not MetaMask');
      return false;
    }

    return true;
  };

  const addMonadNetwork = async () => {
    if (!checkMetaMaskAvailability()) return false;
    
    try {
      console.log('Adding Monad network...');
      await window.ethereum!.request({
        method: 'wallet_addEthereumChain',
        params: [MONAD_TESTNET_CONFIG],
      });
      console.log('Monad network added successfully');
      return true;
    } catch (error) {
      console.error('Failed to add Monad network:', error);
      return false;
    }
  };

  const switchToMonadNetwork = async () => {
    if (!checkMetaMaskAvailability()) return false;
    
    try {
      console.log('Switching to Monad network...');
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
      });
      console.log('Switched to Monad network successfully');
      return true;
    } catch (error: any) {
      console.error('Failed to switch to Monad network:', error);
      // Chain doesn't exist, try to add it
      if (error.code === 4902) {
        console.log('Chain not found, attempting to add...');
        return await addMonadNetwork();
      }
      return false;
    }
  };

  const connectWallet = async () => {
    console.log('Connect wallet clicked');
    
    if (!checkMetaMaskAvailability()) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask extension to connect your wallet.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      console.log('Requesting accounts...');
      // First, try to connect to the wallet
      const accounts = await window.ethereum!.request({ 
        method: 'eth_requestAccounts' 
      });
      
      console.log('Accounts received:', accounts);

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Switch to Monad network
      console.log('Attempting to switch to Monad network...');
      const networkSwitched = await switchToMonadNetwork();
      
      if (!networkSwitched) {
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Monad Testnet in MetaMask and try again.",
          variant: "destructive"
        });
        setIsConnecting(false);
        return;
      }

      const walletAddress = accounts[0];
      console.log('Wallet connected successfully:', walletAddress);
      
      setAddress(walletAddress);
      localStorage.setItem('walletAddress', walletAddress);
      
      toast({
        title: "Wallet Connected!",
        description: `Connected to Monad Testnet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
      
    } catch (error: any) {
      console.error('Connection error:', error);
      
      let errorMessage = "Failed to connect wallet";
      
      if (error.code === 4001) {
        errorMessage = "Connection rejected by user";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending. Please check MetaMask.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    localStorage.removeItem('walletAddress');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <div>
      {address ? (
        <div className="text-center">
          <div className="mb-2 text-white">
            <div className="text-sm opacity-90">Connected to Monad Testnet</div>
            <div className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</div>
          </div>
          <Button 
            onClick={disconnectWallet} 
            variant="outline" 
            className="bg-white/20 border-white text-white hover:bg-white hover:text-purple-600"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="bg-white text-purple-600 hover:bg-gray-100"
        >
          {isConnecting ? 'Connecting...' : 'Connect to Monad'}
        </Button>
      )}
    </div>
  );
};

export default ConnectWallet;
