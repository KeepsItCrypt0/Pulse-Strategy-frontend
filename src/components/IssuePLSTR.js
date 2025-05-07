import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, Card, Stack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { STAKED_PLS_ADDRESS } from '../config';
import ERC20ABI from '../abi/ERC20.json';

const IssuePLSTR = ({ contract, account, signer }) => {
  const [amount, setAmount] = useState('');
  const [approvalNeeded, setApprovalNeeded] = useState(false);
  const [plstrReceived, setPlstrReceived] = useState('0');
  const [fee, setFee] = useState('0');
  const [vplsBalance, setVplsBalance] = useState('0');

  useEffect(() => {
    const checkApproval = async () => {
      if (contract && account && signer && amount) {
        const stakedPLS = new ethers.Contract(STAKED_PLS_ADDRESS, ERC20ABI, signer);
        const allowance = await stakedPLS.allowance(account, contract.address);
        const amountWei = ethers.utils.parseEther(amount || '0');
        setApprovalNeeded(allowance.lt(amountWei));
      }
    };
    const calculatePLSTR = async () => {
      if (contract && amount) {
        try {
          const [plstr, fee] = await contract.calculateSharesReceived(ethers.utils.parseEther(amount || '0'));
          setPlstrReceived(ethers.utils.formatEther(plstr));
          setFee(ethers.utils.formatEther(fee));
        } catch (error) {
          console.error('Calculate PLSTR error:', error);
        }
      }
    };
    const fetchVplsBalance = async () => {
      if (account && signer) {
        try {
          const stakedPLS = new ethers.Contract(STAKED_PLS_ADDRESS, ERC20ABI, signer);
          const balance = await stakedPLS.balanceOf(account);
          setVplsBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Fetch VPLS balance error:', error);
        }
      }
    };
    checkApproval();
    calculatePLSTR();
    fetchVplsBalance();
  }, [contract, account, amount, signer]);

  const handleApprove = async () => {
    try {
      const stakedPLS = new ethers.Contract(STAKED_PLS_ADDRESS, ERC20ABI, signer);
      const tx = await stakedPLS.approve(contract.address, ethers.utils.parseEther(amount));
      await tx.wait();
      setApprovalNeeded(false);
      alert('Approval successful');
    } catch (error) {
      console.error('Approval error:', error);
      alert('Approval failed');
    }
  };

  const handleIssue = async () => {
    try {
      const tx = await contract.issueShares(ethers.utils.parseEther(amount));
      await tx.wait();
      setAmount('');
      alert('PLSTR issued successfully');
    } catch (error) {
      console.error('Issue error:', error);
      alert('Failed to issue PLSTR');
    }
  };

  return (
    <Card mb={6}>
      <Box p={4}>
        <Heading size="md" mb={4}>Issue PLSTR</Heading>
        <Stack spacing={3}>
          <Text fontSize="md">Your VPLS Balance: {vplsBalance}</Text>
          <Input
            placeholder="Amount in VPLS"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            size="md"
          />
          <Text fontSize="sm">You will receive: {plstrReceived} PLSTR (Fee: {fee} VPLS)</Text>
          {approvalNeeded ? (
            <Button onClick={handleApprove} isDisabled={!amount} size="md">
              Approve VPLS
            </Button>
          ) : (
            <Button onClick={handleIssue} isDisabled={!amount} size="md">
              Issue PLSTR
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
};

export default IssuePLSTR;
