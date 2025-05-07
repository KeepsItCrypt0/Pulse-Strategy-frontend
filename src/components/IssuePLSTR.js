import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import ERC20ABI from '../abi/ERC20.json';
import { STAKED_PLS_ADDRESS } from '../config';

function IssuePLSTR({ contract, account, signer }) {
  const [amount, setAmount] = useState('');
  const [vplsBalance, setVplsBalance] = useState(null);
  const [shares, setShares] = useState('');
  const [fee, setFee] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const fetchVplsBalance = async () => {
    if (!account || !signer) return;
    try {
      const vplsContract = new ethers.Contract(STAKED_PLS_ADDRESS, ERC20ABI, signer);
      const balance = await vplsContract.balanceOf(account);
      const decimals = await vplsContract.decimals();
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      console.log('VPLS Balance:', formattedBalance);
      setVplsBalance(formattedBalance);
    } catch (error) {
      console.error('Error fetching VPLS balance:', error.message);
      setVplsBalance('Error');
      toast({
        title: 'Error',
        description: 'Failed to fetch VPLS balance. Check console for details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateShares = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setShares('');
      setFee('');
      return;
    }
    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 18);
      const [sharesReceived, feeAmount] = await contract.calculateSharesReceived(parsedAmount);
      setShares(ethers.utils.formatUnits(sharesReceived, 18));
      setFee(ethers.utils.formatUnits(feeAmount, 18));
    } catch (error) {
      console.error('Error calculating shares:', error.message);
      setShares('Error');
      setFee('Error');
      toast({
        title: 'Error',
        description: 'Failed to calculate shares. Check console for details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleIssueShares = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 18);
      const tx = await contract.issueShares(parsedAmount);
      await tx.wait();
      toast({
        title: 'Success',
        description: 'Shares issued successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setAmount('');
      setShares('');
      setFee('');
      fetchVplsBalance();
    } catch (error) {
      console.error('Error issuing shares:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to issue shares. Check console for details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVplsBalance();
  }, [account, signer]);

  useEffect(() => {
    calculateShares();
  }, [amount]);

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.900">
      <Text fontSize="xl" mb={4}>Issue PLSTR</Text>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Amount (VPLS)</FormLabel>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter VPLS amount"
            bg="gray.800"
            color="white"
            borderColor="gray.700"
          />
        </FormControl>
        <Text>
          Your VPLS Balance: {vplsBalance !== null ? `${vplsBalance} VPLS` : 'Loading...'}
        </Text>
        <Text>
          You will receive: {shares ? `${shares} PLSTR` : '0 PLSTR'} (Fee: {fee ? `${fee} VPLS` : '0 VPLS'})
        </Text>
        <Button
          onClick={handleIssueShares}
          isLoading={isLoading}
          isDisabled={!account || !amount || parseFloat(amount) <= 0}
          colorScheme="teal"
        >
          Issue Shares
        </Button>
      </VStack>
    </Box>
  );
}

export default IssuePLSTR;
