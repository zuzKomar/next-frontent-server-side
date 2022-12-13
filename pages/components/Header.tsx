import { Flex, View } from '@adobe/react-spectrum';
import logo from '../../public/static/logo3.png';
import Image from 'next/image';
import { Navbar } from './Navbar';

export const Header = () => {
  return (
    <Flex direction="column" justifyContent="center">
      <View backgroundColor="static-black">
        <div
          style={{
            margin: '0 auto',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Image src={logo} alt="rent a car logo" width="240px" height="120px" />
          <Navbar />
        </div>
      </View>
    </Flex>
  );
};
