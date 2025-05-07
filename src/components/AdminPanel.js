import { Box, Heading, Card } from '@chakra-ui/react';
import DepositStakedPLS from './DepositStakedPLS';
import MintPLSTR from './MintPLSTR';
import RecoverTokens from './RecoverTokens';
import TransferOwnership from './TransferOwnership';

const AdminPanel = ({ contract, account, signer }) => (
  <Card mb={6}>
    <Box p={4}>
      <Heading size="md" mb={4}>Admin Panel</Heading>
      <DepositStakedPLS contract={contract} account={account} signer={signer} />
      <MintPLSTR contract={contract} account={account} />
      <RecoverTokens contract={contract} account={account} />
      <TransferOwnership contract={contract} account={account} />
    </Box>
  </Card>
);

export default AdminPanel;
