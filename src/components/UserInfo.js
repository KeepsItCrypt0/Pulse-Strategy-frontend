import { useState, useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

const UserInfo = ({ contract, account }) => {
  const [shareBalance, setShareBalance] = useState('0');
  const [redeemablePLS, setRedeemablePLS] = useState('0');
  const [contractBalance, setContractBalance] = useState('0');
  const [issuancePeriod, setIssuancePeriod] = useState('0');
  const [vplsRatio, setVplsRatio] = useState('0');

  useEffect(() => {
    const fetchData = async () => {
      if (contract && account) {
        try {
          const balance = await contract.balanceOf(account);
          setShareBalance(ethers.utils.formatEther(balance));

          const redeemable = await contract.getRedeemableStakedPLS(account, balance);
          setRedeemablePLS(ethers.utils.formatEther(redeemable));

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
    <Box mb={6}>
      <Heading size="md" mb={2}>Your Info</Heading>
      <Text>PLSTR Balance: {shareBalance}</Text>
      <Text>Redeemable VPLS: {redeemablePLS}</Text>
      <Text>Contract VPLS Balance: {contractBalance}</Text>
      <Text>Remaining Issuance Period: {issuancePeriod} seconds</Text>
      <Text>VPLS Backing Ratio: {vplsRatio}</Text>
    </Box>
  );
};

export default UserInfo;
