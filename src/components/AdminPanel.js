import { Box, Heading } from '@chakra-ui/react';
import DepositStakedPLS from './DepositStakedPLS';
import MintShares from './MintShares';
import RecoverTokens from './RecoverTokens';
import TransferOwnership from './TransferOwnership';

const AdminPanel = ({ contract, account, signer }) => (
  <Box mb={6} p={4} borderWidth="1px" borderRadius="md">
    <Heading size="md" mb={4}>Admin Panel</Heading>
    <DepositStakedPLS contract={contract} account={account} signer={signer} />
    <MintShares contract={contract} account={account} />
    <RecoverTokens contract={contract} account={account} />
    <TransferOwnership contract={contract} account={account} />
  </Box>
);

export default AdminPanel;
