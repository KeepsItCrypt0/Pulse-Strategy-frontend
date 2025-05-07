import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, Card, Stack } from '@chakra-ui/react';
import { ethers } from 'ethers';

const RedeemPLSTR = ({ contract, account, signer }) => {
  const [amount, setAmount] = useState('');
  const [estimatedVPLS, setEstimatedVPLS] = useState('0');
  const [plstrBalance, setPlstrBalance] = useState('0');

  useEffect(() => {
    const calculateVPLS = async () => {
      if (contract && account && amount) {
        try {
          const vpls = await contract.getRedeemableStakedPLS(account, ethers.utils.parseEther(amount || '0'));
          setEstimatedVPLS(ethers.utils.formatEther(vpls));
        } catch (error) {
          console.error('Calculate VPLS error:', error);
        }
      }
    };
    const fetchPlstrBalance = async () => {
      if (contract && account) {
        try {
          const balance = await contract.balanceOf(account);
          setPlstrBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Fetch PLSTR balance error:', error);
        }
      }
    };
    calculateVPLS();
    fetchPlstrBalance();
  }, [contract, account, amount]);

  const handleRedeem = async () => {
    try {
      const tx = await contract.redeemShares(ethers.utils.parseEther(amount));
      await tx.wait();
      setAmount('');
      alert('PLSTR redeemed successfully');
    } catch (error) {
      console.error('Redeem error:', error);
      alert('Failed to redeem PLSTR');
    }
  };

  return (
    <Card mb={6}>
      <Box p={4}>
        <Heading size="md" mb={4}>Redeem PLSTR</Heading>
        <Stack spacing={3}>
          <Text fontSize="md">Your PLSTR Balance: {plstrBalance}</Text>
          <Input
            placeholder="Amount in PLSTR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            size="md"
          />
          <Text fontSize="sm">You will receive: {estimatedVPLS} VPLS</Text>
          <Button onClick={handleRedeem} isDisabled={!amount} size="md">
            Redeem PLSTR
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default RedeemPLSTR;
