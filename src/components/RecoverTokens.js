import { useState } from 'react';
import { Box, Heading, Input, Button, Card, Stack } from '@chakra-ui/react';
import { ethers } from 'ethers';

const RecoverTokens = ({ contract, account }) => {
  const [token, setToken] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleRecover = async () => {
    try {
      const tx = await contract.recoverTokens(token, recipient, ethers.utils.parseEther(amount));
      await tx.wait();
      setToken('');
      setRecipient('');
      setAmount('');
      alert('Tokens recovered successfully');
    } catch (error) {
      console.error('Recover error:', error);
      alert('Failed to recover tokens');
    }
  };

  return (
    <Card mb={4}>
      <Box p={4}>
        <Heading size="sm" mb={4}>Recover Tokens</Heading>
        <Stack spacing={3}>
          <Input
            placeholder="Token Address"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            size="md"
          />
          <Input
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            size="md"
          />
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            size="md"
          />
          <Button
            onClick={handleRecover}
            isDisabled={!token || !recipient || !amount}
            size="md"
          >
            Recover Tokens
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default RecoverTokens;
