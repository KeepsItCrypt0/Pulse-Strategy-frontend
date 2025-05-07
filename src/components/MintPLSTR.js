import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, Card, Stack } from '@chakra-ui/react';
import { ethers } from 'ethers';

const MintPLSTR = ({ contract, account }) => {
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
      alert('PLSTR minted successfully');
    } catch (error) {
      console.error('Mint error:', error);
      alert('Failed to mint PLSTR');
    }
  };

  return (
    <Card mb={4}>
      <Box p={4}>
        <Heading size="sm" mb={4}>Mint PLSTR</Heading>
        <Stack spacing={3}>
          <Input
            placeholder="Amount in PLSTR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            size="md"
          />
          <Text fontSize="sm">
            Next mint available: {new Date(Number(nextMintTime) * 1000).toLocaleString()}
          </Text>
          <Button onClick={handleMint} isDisabled={!amount} size="md">
            Mint PLSTR
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default MintPLSTR;
