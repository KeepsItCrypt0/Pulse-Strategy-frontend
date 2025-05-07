import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Button, Text, Alert, AlertIcon, Link, extendTheme } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, INFURA_URL } from './config';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import UserInfo from './components/UserInfo';
import IssueShares from './components/IssueShares';
import RedeemShares from './components/RedeemShares';
import AdminPanel from './components/AdminPanel';
import TransactionHistory from './components/TransactionHistory';

// Define dark mode theme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.800',
        color: 'white',
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
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setConnectionError('MetaMask is not installed. Please install MetaMask and try again.');
      return;
    }

    try {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await web3Provider.getNetwork();
      if (network.chainId !== 1) {
        setNetworkError('Please switch to Ethereum Mainnet in MetaMask');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          });
          setNetworkError('');
        } catch (switchError) {
          console.error('Network switch error:', switchError);
          setNetworkError('Failed to switch to Ethereum Mainnet. Please do it manually in MetaMask.');
          return;
        }
      }
      await web3Provider.send('eth_requestAccounts', []);
      const signer = web3Provider.getSigner();
      const account = await signer.getAddress();
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
      <Box p={4} maxW="800px" mx="auto">
        <Header account={account} connectWallet={connectWallet} />
        <Text mb={4}>
          Contract Address:{' '}
          <Link
            href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
            isExternal
            color="blue.300"
          >
            {CONTRACT_ADDRESS}
          </Link>
        </Text>
        {networkError && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {networkError}
          </Alert>
        )}
        {connectionError && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {connectionError}
          </Alert>
        )}
        {account ? (
          <>
            <Text mb={4}>Connected: {account}</Text>
            <UserInfo contract={contract} account={account} />
            <IssueShares contract={contract} account={account} signer={signer} />
            <RedeemShares contract={contract} account={account} />
            {isStrategyController && (
              <AdminPanel contract={contract} account={account} signer={signer} />
            )}
            <TransactionHistory contract={contract} account={account} />
          </>
        ) : (
          <Button colorScheme="blue" onClick={connectWallet}>
            Connect MetaMask
          </Button>
        )}
        <Disclaimer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
