import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Button, Alert, AlertIcon, extendTheme } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, INFURA_URL } from './config';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import UserInfo from './components/UserInfo';
import IssuePLSTR from './components/IssuePLSTR';
import RedeemPLSTR from './components/RedeemPLSTR';
import AdminPanel from './components/AdminPanel';
import TransactionHistory from './components/TransactionHistory';
import ContractInfo from './components/ContractInfo';

// Define dark mode theme with gradient
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'linear-gradient(135deg, #4B0000, #00004B)',
        color: 'white',
        minHeight: '100vh',
      },
    },
  },
  colors: {
    brand: {
      button: 'gray.700',
      link: 'teal.300',
    },
  },
  components: {
    Button: {
      baseStyle: {
        bg: 'brand.button',
        color: 'white',
        _hover: { bg: 'gray.600' },
        borderRadius: 'md',
        boxShadow: 'sm',
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'gray.900',
          color: 'white',
          borderColor: 'gray.700',
          _hover: { borderColor: 'gray.600' },
          _focus: { borderColor: 'teal.300', boxShadow: '0 0 0 1px teal.300' },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'gray.900',
          borderColor: 'gray.700',
          borderWidth: '1px',
          borderRadius: 'md',
          p: 4,
        },
      },
    },
  },
});

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isStrategyController, setIsStrategyController] = useState(false);
  const [networkError, setNetworkError] = useState('');
  const [connectionError, setConnectionError] = useState('');

  const initializeProvider = () => {
    try {
      const infuraProvider = new ethers.providers.JsonRpcProvider(INFURA_URL);
      setProvider(infuraProvider);
      setContract(new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, infuraProvider));
    } catch (error) {
      console.error('Infura provider error:', error);
      setConnectionError('Failed to initialize provider. Please refresh the page.');
    }
  };

  useEffect(() => {
    initializeProvider();
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        const newChainId = parseInt(chainId, 16);
        console.log('Chain changed:', { chainId, newChainId });
        if (newChainId !== 1) {
          setNetworkError(`Network changed to chainId ${newChainId}. Please switch to Ethereum Mainnet in MetaMask (Settings > Networks) and remove any unknown networks, especially chainId 1936529372.`);
        } else {
          setNetworkError('');
          if (account) connectWallet();
        }
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [account]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setConnectionError('MetaMask is not installed. Please install MetaMask and try again.');
      return;
    }

    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await web3Provider.getNetwork();
      console.log('Detected network:', network);
      if (network.chainId !== 1) {
        console.log('Attempting to switch to Ethereum Mainnet');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          });
          const newNetwork = await web3Provider.getNetwork();
          if (newNetwork.chainId !== 1) {
            setNetworkError('Failed to switch to Ethereum Mainnet. Please switch manually in MetaMask (Settings > Networks) and remove chainId 1936529372 if present.');
            return;
          }
        } catch (switchError) {
          console.error('Network switch error:', switchError);
          setNetworkError('Failed to switch to Ethereum Mainnet. Please switch manually in MetaMask (Settings > Networks) and remove chainId 1936529372 if present.');
          return;
        }
      }
      await web3Provider.send('eth_requestAccounts', []);
      const signer = web3Provider.getSigner();
      const account = await signer.getAddress();
      console.log('Connected account:', account);
      setProvider(web3Provider);
      setSigner(signer);
      setAccount(account);
      setNetworkError('');
      setConnectionError('');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
      const owner = await contract.owner();
      setIsStrategyController(account.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectionError(`Failed to connect wallet: ${error.message}`);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box p={6} maxW="900px" mx="auto">
        <Header account={account} connectWallet={connectWallet} />
        {networkError && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {networkError}
          </Alert>
        )}
        {connectionError && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {connectionError}
          </Alert>
        )}
        <ContractInfo contract={contract} />
        {account ? (
          <>
            <UserInfo contract={contract} account={account} />
            <IssuePLSTR contract={contract} account={account} signer={signer} />
            <RedeemPLSTR contract={contract} account={account} signer={signer} />
            {isStrategyController && (
              <AdminPanel contract={contract} account={account} signer={signer} />
            )}
            <TransactionHistory contract={contract} account={account} />
          </>
        ) : (
          <Button onClick={connectWallet} size="lg">
            Connect MetaMask
          </Button>
        )}
        <Disclaimer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
