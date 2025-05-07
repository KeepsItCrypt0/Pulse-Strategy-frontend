import React, { useState, useEffect } from 'react';
import { Box, Text, VStack, Link } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, STAKED_PLS_ADDRESS } from '../config';

function ContractInfo({ contract }) {
  const [contractBalance, setContractBalance] = useState(null);
  const [totalIssued, setTotalIssued] = useState(null);
  const [remainingIssuance, setRemainingIssuance] = useState(null);
  const [backingRatio, setBackingRatio] = useState(null);

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const fetchContractInfo = async () => {
    if (!contract) return;
    try {
      const [balance, remainingPeriod] = await contract.getContractInfo();
      setContractBalance(ethers.utils.formatUnits(balance, 18));
      setRemainingIssuance(remainingPeriod.toNumber());

      const total = await contract.totalSupply();
      setTotalIssued(ethers.utils.formatUnits(total, 18));

      const ratio = await contract.getVPLSBackingRatio();
      setBackingRatio(ethers.utils.formatUnits(ratio, 18));
    } catch (error) {
      console.error('Error fetching contract info:', error.message);
      setContractBalance('Error');
      setTotalIssued('Error');
      setRemainingIssuance('Error');
      setBackingRatio('Error');
    }
  };

  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return 'Ended';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `Ends in ${days} days, ${hours} hours, ${minutes} minutes`;
  };

  useEffect(() => {
    fetchContractInfo();
  }, [contract]);

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.900">
      <Text fontSize="xl" mb={4}>Contract Info</Text>
      <VStack spacing={2} align="start">
        <Text>
          Contract Address:{' '}
          <Link href="https://etherscan.io/address/0x6c1dA678A1B615f673208e74AB3510c22117090e" isExternal color="teal.300">
            {truncateAddress(CONTRACT_ADDRESS)}
          </Link>
        </Text>
        <Text>
          VPLS Balance: {contractBalance !== null ? `${contractBalance} VPLS` : 'Loading...'} (
          <Link href="https://etherscan.io/address/0x0181e249c507d3b454dE2444444f0Bf5dBE72d09" isExternal color="teal.300">
            {truncateAddress(STAKED_PLS_ADDRESS)}
          </Link>)
        </Text>
        <Text>Total PLSTR Issued: {totalIssued !== null ? `${totalIssued} PLSTR` : 'Loading...'}</Text>
        <Text>Issuance Period: {remainingIssuance !== null ? formatTimeRemaining(remainingIssuance) : 'Loading...'}</Text>
        <Text>VPLS Backing Ratio: {backingRatio !== null ? `${backingRatio}` : 'Loading...'}</Text>
      </VStack>
    </Box>
  );
}

export default ContractInfo;
