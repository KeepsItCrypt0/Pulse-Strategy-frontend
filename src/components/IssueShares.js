import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { STAKED_PLS_ADDRESS } from '../config';
import ERC20ABI from '../abi/ERC20.json';

const IssueShares = ({ contract, account, signer }) => {
  const [amount, setAmount] = useState('');
  const [approvalNeeded, setApprovalNeeded] = useState(false);
  const [sharesReceived, setSharesReceived] = useState('0');
  const [fee, setFee] = useState('0');

  useEffect(() => {
    const checkApproval = async () => {
      if (contract && account && signer && amount) {
        const stakedPLS = new ethers.Contract(STAKED_PLS_ADDRESS, ERC20ABI, signer);
        const allowance = await stakedPLS.allowance(account, contract.address);
        const amountWei = ethers.utils.parseEther(amount || '0');
        setApprovalNeeded(allowance.lt(amountWei));
      }
    };
    const calculateShares = async () => {
      if (contract && amount) {
        try {
          const [shares, fee] = await contract.calculateSharesReceived(ethers.utils.parseEther(amount || '0'));
          setSharesReceived(ethers.utils.formatEther(shares));
          setFee(ethers.utils.formatEther(fee));
        } catch (error) {
          console.error('Calculate shares error:', error);
        }
      }
    };
    checkApproval();
    calculateShares();
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
      alert('Shares issued successfully');
    } catch (error) {
      console.error('Issue error:', error);
      alert('Failed to issue shares');
    }
  };

  return (
    <Box mb={6}>
      <Heading size="md" mb={2}>Issue Shares</Heading>
      <Input
        placeholder="Amount in VPLS"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb={2}
        type="number"
      />
      <Text mb={2}>You will receive: {sharesReceived} PLSTR (Fee: {fee} VPLS)</Text>
      {approvalNeeded ? (
        <Button colorScheme="green" onClick={handleApprove} isDisabled={!amount}>
          Approve VPLS
        </Button>
      ) : (
        <Button colorScheme="blue" onClick={handleIssue} isDisabled={!amount}>
          Issue Shares
        </Button>
      )}
    </Box>
  );
};

export default IssueShares;
