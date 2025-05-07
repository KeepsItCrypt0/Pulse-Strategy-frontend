import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

const MintShares = ({ contract, account }) => {
  const [amount, setAmount] = useState('');
  const [nextMintTime, setNextMintTime] = useState('0');

  useEffect(() => {
    const fetchMintInfo = async () => {
      if (contract && account) {
        try {
          const nextTime = await contract.getOwnerMintInfo();
          setNextMintTime(nextTime.toString());
        } catch (error) {
          console.error('Fetch mint info error:', error);
        }
      }
    };
    fetchMintInfo();
  }, [contract, account]);

  const handleMint = async () => {
    try {
      const tx = await contract.mintShares(ethers.utils.parseEther(amount));
      await tx.wait();
      setAmount('');
      alert('Shares minted successfully');
    } catch (error) {
      console.error('Mint error:', error);
      alert('Failed to mint shares');
    }
  };

  return (
    <Box mb={4}>
      <Heading size="sm" mb={2}>Mint Shares</Heading>
      <Input
        placeholder="Amount in PLSTR"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb={2}
        type="number"
      />
      <Text mb={2}>
        Next mint available: {new Date(Number(nextMintTime) * 1000).toLocaleString()}
      </Text>
      <Button colorScheme="blue" onClick={handleMint} isDisabled={!amount}>
        Mint Shares
      </Button>
    </Box>
  );
};

export default MintShares;
