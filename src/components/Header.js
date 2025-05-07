import { Box, Image, Link, Button, Flex } from '@chakra-ui/react';

const Header = ({ account, connectWallet }) => (
  <Flex mb={6} justify="space-between" align="center">
    <Image src="/logo.png" alt="PulseStrategy Logo" boxSize="50px" />
    <Box>
      <Link
        href="https://x.com/pulsestrategy"
        isExternal
        mr={4}
        color="blue.300"
      >
        X @pulsestrategy
      </Link>
      {!account && (
        <Button colorScheme="blue" onClick={connectWallet}>
          Connect MetaMask
        </Button>
      )}
    </Box>
  </Flex>
);

export default Header;
