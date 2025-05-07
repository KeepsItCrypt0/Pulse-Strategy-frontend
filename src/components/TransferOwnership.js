import { useState } from 'react';
import { Box, Heading, Input, Button, Card, Stack } from '@chakra-ui/react';

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
    <Card mb={4}>
      <Box p={4}>
        <Heading size="sm" mb={4}>Transfer Ownership</Heading>
        <Stack spacing={3}>
          <Input
            placeholder="New Controller Address"
            value={newController}
            onChange={(e) => setNewController(e.target.value)}
            size="md"
          />
          <Button onClick={handleTransfer} isDisabled={!newController} size="md">
            Transfer Ownership
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default TransferOwnership;
