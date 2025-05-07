import { Box, Image, Link, Button, Flex } from '@chakra-ui/react';
import logo from '../../public/logo.png';

const Header = ({ account, connectWallet }) => (
  <Flex mb={6} justify="space-between" align="center">
    <Image src={logo} alt="PulseStrategy Logo" boxSize="50px" />
    <Box>
      <Link
        href="https://x.com/pulsestrategy"
        isExternal
        mr={4}
        color="blue.500"
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
