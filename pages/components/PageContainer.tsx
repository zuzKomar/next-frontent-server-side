import { Header } from './Header';
import { Footer } from './Footer';
import { Flex, View } from '@adobe/react-spectrum';

export const PageContainer = ({ children }: any): JSX.Element => {
  return (
    <Flex direction="column" width="100%" alignContent="center" justifyContent="center">
      <Header />
        <View backgroundColor="magenta-600" paddingBottom="10px">
          <Flex direction="column" justifyContent="center" alignItems="center">
            {children}
          </Flex>
        </View>
      <Footer />
    </Flex>
  );
};
