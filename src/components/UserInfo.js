import React, { useState, useEffect } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';

function UserInfo({ contract, account }) {
  const [plstrBalance, setPlstrBalance] = useState(null);
  const [redeemableVpls, setRedeemableVpls] = useState(null);

  const fetchUserInfo = async () => {
    if (!contract || !account) return;
    try {
      const balance = await contract.balanceOf(account);
      setPlstrBalance(ethers.utils.formatUnits(balance, 18));

      const redeemable = await contract.getRedeemableStakedPLS(account, balance);
      setRedeemableVpls(ethers.utils.formatUnits(redeemable, 18));
    } catch (error) {
      console.error('Error fetching user info:', error.message);
      setPlstrBalance('Error');
      setRedeemableVpls('Error');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [contract, account]);

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.900">
      <Text fontSize="xl" mb={4}>Your PLSTR Info</Text>
      <VStack spacing={2} align="start">
        <Text>Connected Address: {account}</Text>
        <Text>PLSTR Balance: {plstrBalance !== null ? `${plstrBalance} PLSTR` : 'Loading...'}</Text>
        <Text>Redeemable VPLS: {redeemableVpls !== null ? `${redeemableVpls} VPLS` : 'Loading...'}</Text>
      </VStack>
    </Box>
  );
}

export default UserInfo;
