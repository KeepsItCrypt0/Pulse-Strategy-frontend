import { useState } from 'react';
import { Box, Heading, Input, Button } from '@chakra-ui/react';

const TransferOwnership = ({ contract, account }) => {
  const [newController, setNewController] = useState('');

  const handleTransfer = async () => {
    try {
      const tx = await contract.transferOwnership(newController);
      await tx.wait();
      setNewController('');
      alert('Ownership transferred successfully');
    } catch (error) {
      console.error('Transfer error:', error);
      alert('Failed to transfer ownership');
    }
  };

  return (
    <Box mb={4}>
      <Heading size="sm" mb={2}>Transfer Ownership</Heading>
      <Input
        placeholder="New Controller Address"
        value={newController}
        onChange={(e) => setNewController(e.target.value)}
        mb={2}
      />
      <Button colorScheme="blue" onClick={handleTransfer} isDisabled={!newController}>
        Transfer Ownership
      </Button>
    </Box>
  );
};

export default TransferOwnership;
