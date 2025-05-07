import { useState, useEffect } from 'react';
import { Box, Heading, Text, Card, Stack, Link } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../config';

const formatTimeRemaining = (seconds) => {
  if (!seconds || seconds === '0') return 'No active issuance period';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `Ends in ${days} days, ${hours} hours, ${minutes} minutes`;
};

const ContractInfo = ({ contract }) => {
  const [vplsBalance, setVplsBalance] = useState('0');
  const [totalPLSTR, setTotalPLSTR] = useState('0');
  const [issuancePeriod, setIssuancePeriod] = useState('0');

  useEffect(() => {
    const fetchData = async () => {
      if (contract) {
        try {
          const { contractBalance: bal, remainingIssuancePeriod: period } = await contract.getContractInfo();
          setVplsBalance(ethers.utils.formatEther(bal));
          setIssuancePeriod(period.toString());

          const total = await contract.totalSupply();
          setTotalPLSTR(ethers.utils.formatEther(total));
        } catch (error) {
          console.error('Contract info fetch error:', error);
        }
      }
    };
    fetchData();
  }, [contract]);

  return (
    <Card mb={6}>
      <Box p={4}>
        <Heading size="md" mb={4}>Contract Info</Heading>
        <Stack spacing={3}>
          <Text fontSize="md">
            PulseStrategy Contract:{' '}
            <Link
              href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
              isExternal
              color="brand.link"
            >
              {CONTRACT_ADDRESS}
            </Link>
          </Text>
          <Text fontSize="md">VPLS Contract Balance: {vplsBalance}</Text>
          <Text fontSize="md">Total PLSTR Issued: {totalPLSTR}</Text>
          <Text fontSize="md">Issuance Period: {formatTimeRemaining(issuancePeriod)}</Text>
        </Stack>
      </Box>
    </Card>
  );
};

export default ContractInfo;
