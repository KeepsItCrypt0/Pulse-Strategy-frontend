import { Box, Image, Link, Flex } from '@chakra-ui/react';

const Header = ({ account, connectWallet }) => (
  <Flex mb={8} justify="space-between" align="center">
    <Image src="/logo.png" alt="PulseStrategy Logo" boxSize="70px" />
    <Box>
      <Link
        href="https://x.com/pulsestrategy"
        isExternal
        mr={4}
        color="brand.link"
        fontSize="md"
      >
        @pulsestrategy
      </Link>
    </Box>
  </Flex>
);

export default Header;
