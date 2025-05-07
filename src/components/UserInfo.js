import { useState, useEffect } from 'react';
import { Box, Heading, Text, Card, Stack } from '@chakra-ui/react';
import { ethers } from 'ethers';

const UserInfo = ({ contract, account }) => {
  const [plstrBalance, setPlstrBalance] = useState('0');
  const [redeemableVPLS, setRedeemableVPLS] = useState('0');
  const [contractBalance, setContractBalance] = useState('0');
  const [issuancePeriod, setIssuancePeriod] = useState('0');
  const [vplsRatio, setVplsRatio] = useState('0');

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        try {
          const balance = await contract.balanceOf(account);
          setPlstrBalance(ethers.utils.formatEther(balance));

          const redeemable = await contract.getRedeemableStakedPLS(account, balance);
          setRedeemableVPLS(ethers.utils.formatEther(redeemable));

          const { contractBalance: bal, remainingIssuancePeriod: period } = await contract.getContractInfo();
          setContractBalance(ethers.utils.formatEther(bal));
          setIssuancePeriod(period.toString());

          const ratio = await contract.getVPLSBackingRatio();
          setVplsRatio(ethers.utils.formatEther(ratio));
        } catch (error) {
          console.error('Fetch error:', error);
        }
      }
    };
    fetchData();
  }, [contract, account]);

  return (
    <Card mb={6}>
      <Box p={4}>
        <Heading size="md" mb={4}>Your PLSTR Info</Heading>
        <Stack spacing={3}>
          <Text fontSize="md">Connected Address: {account}</Text>
          <Text fontSize="md">PLSTR Balance: {plstrBalance}</Text>
          <Text fontSize="md">Redeemable VPLS: {redeemableVPLS}</Text>
          <Text fontSize="md">Contract VPLS Balance: {contractBalance}</Text>
          <Text fontSize="md">Remaining Issuance Period: {issuancePeriod} seconds</Text>
          <Text fontSize="md">VPLS Backing Ratio: {vplsRatio}</Text>
        </Stack>
      </Box>
    </Card>
  );
};

export default UserInfo;
