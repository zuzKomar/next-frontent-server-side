import { Header } from './Header';
import { Footer } from './Footer';
import { Flex, View } from '@adobe/react-spectrum';

export const PageContainer = ({ children }: any): JSX.Element => {
  return (
    <Flex direction="column" width="100%" alignContent="center">
      <Header />
      <View backgroundColor="magenta-600">{children}</View>
      <Footer />
    </Flex>
  );
};
