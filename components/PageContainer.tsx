import { Header } from './Header';
import { Footer } from './Footer';
import { Flex, View } from '@adobe/react-spectrum';
import style from './PageContainer.module.css';

export const PageContainer = ({ children }: any): JSX.Element => {
  return (
    <Flex direction="column" width="100%" height="100%" justifyContent="center" alignItems="center">
      <Header />
      <div className={style.experiment}>
        <View
          paddingBottom="40px"
          minHeight="85vh"
          width="60%"
          UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <Flex direction="column" justifyContent="center" alignItems="center" flex="1 0 auto">
            {children}
          </Flex>
        </View>
      </div>
      <Footer />
    </Flex>
  );
};
