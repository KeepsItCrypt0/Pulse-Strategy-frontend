import { Text, Box } from '@chakra-ui/react';

const Disclaimer = () => (
  <Box mt={8} textAlign="center">
    <Text fontSize="sm" color="gray.400">
      This is a decentralized finance application. Use at your own risk. Always do your own research. Not financial advice.
    </Text>
  </Box>
);

export default Disclaimer;
