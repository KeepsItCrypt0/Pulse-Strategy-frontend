import { useState, useEffect } from 'react';
import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';

const TransactionHistory = ({ contract, account }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (contract && account) {
        try {
          const filterIssued = contract.filters.SharesIssued(account);
          const issuedEvents = await contract.queryFilter(filterIssued, -10000, 'latest');
          const filterRedeemed = contract.filters.SharesRedeemed(account);
          const redeemedEvents = await contract.queryFilter(filterRedeemed, -10000, 'latest');
          const allEvents = [...issuedEvents, ...redeemedEvents]
            .sort((a, b) => b.blockNumber - a.blockNumber)
            .slice(0, 10); // Limit to last 10 events
          setEvents(allEvents);
        } catch (error) {
          console.error('Fetch events error:', error);
        }
      }
    };
    fetchEvents();
  }, [contract, account]);

  return (
    <Box mb={6}>
      <Heading size="md" mb={2}>Transaction History</Heading>
      <List spacing={2}>
        {events.map((event, index) => (
          <ListItem key={index}>
            <Text>
              {event.event === 'SharesIssued' ? 'Issued' : 'Redeemed'}:{" "}
              {ethers.utils.formatEther(event.args.shares)} PLSTR
              {event.args.stakedPLS && `, ${ethers.utils.formatEther(event.args.stakedPLS)} VPLS`}
              {' '}
              (Block: {event.blockNumber})
            </Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TransactionHistory;
