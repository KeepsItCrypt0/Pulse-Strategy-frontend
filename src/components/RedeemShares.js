import { useState } from 'react';
import { Box, Heading, Input, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';

const RedeemShares = ({ contract, account }) => {
  const [amount, setAmount] = useState('');

  const handleRedeem = async () => {
    try {
      const tx = await contract.redeemShares(ethers.utils.parseEther(amount));
      await tx.wait();
      setAmount('');
      alert('Shares redeemed successfully');
    } catch (error) {
      console.error('Redeem error:', error);
      alert('Failed to redeem shares');
    }
  };

  return (
    <Box mb={6}>
      <Heading size="md" mb={2}>Redeem Shares</Heading>
      <Input
        placeholder="Amount in PLSTR"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb={2}
        type="number"
      />
      <Button colorScheme="blue" onClick={handleRedeem} isDisabled={!amount}>
        Redeem Shares
      </Button>
    </Box>
  );
};

export default RedeemShares;
