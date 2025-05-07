import { useState } from 'react';
import { Box, Heading, Input, Button } from '@chakra-ui/react';
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
    <Box mb={4}>
      <Heading size="sm" mb={2}>Recover Tokens</Heading>
      <Input
        placeholder="Token Address"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        mb={2}
      />
      <Input
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        mb={2}
      />
      <Input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb={2}
        type="number"
      />
      <Button
        colorScheme="blue"
        onClick={handleRecover}
        isDisabled={!token || !recipient || !amount}
      >
        Recover Tokens
      </Button>
    </Box>
  );
};

export default RecoverTokens;
