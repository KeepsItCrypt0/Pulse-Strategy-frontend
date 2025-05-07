import { useState, useEffect } from 'react';
import { Box, Heading, Input, Button } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { STAKED_PLS_ADDRESS } from '../config';
import ERC20ABI from '../abi/ERC20.json';

const DepositStakedPLS = ({ contract, account, signer }) => {
  const [amount, setAmount] = useState('');
  const [approvalNeeded, setApprovalNeeded] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      if (contract && account && signer && amount) {
        const stakedPLS = new ethers.Contract(STAKED_PLS_ADDRESS, ERC20ABI, signer);
        const allowance = await stakedPLS.allowance(account, contract.address);
        const amountWei = ethers.utils.parseEther(amount || '0');
        setApprovalNeeded(allowance.lt(amountWei));
      }
    };
    checkApproval();
  }, [contract, account, amount, signer]);

  const handleApprove = async () => {
    try {
      const stakedPLS = new ethers.Contract(STAKED_PLS_ADDRESS, ERC20ABI, signer);
      const tx = await stakedPLS.approve(contract.address, ethers.utils.parseEther(amount));
      await tx.wait();
      setApprovalNeeded(false);
      alert('Approval successful');
    } catch (error) {
      console.error('Approval error:', error);
      alert('Approval failed');
    }
  };

  const handleDeposit = async () => {
    try {
      const tx = await contract.depositStakedPLS(ethers.utils.parseEther(amount));
      await tx.wait();
      setAmount('');
      alert('Deposit successful');
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Failed to deposit');
    }
  };

  return (
    <Box mb={4}>
      <Heading size="sm" mb={2}>Deposit VPLS</Heading>
      <Input
        placeholder="Amount in VPLS"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        mb={2}
        type="number"
      />
      {approvalNeeded ? (
        <Button colorScheme="green" onClick={handleApprove} isDisabled={!amount}>
          Approve VPLS
        </Button>
      ) : (
        <Button colorScheme="blue" onClick={handleDeposit} isDisabled={!amount}>
          Deposit
        </Button>
      )}
    </Box>
  );
};

export default DepositStakedPLS;
