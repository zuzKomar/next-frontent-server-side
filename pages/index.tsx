import { Flex, Text } from '@adobe/react-spectrum';
import type { NextPage } from 'next';
import { PageContainer } from './components/PageContainer';

const Home: NextPage = () => {
  return (
    <PageContainer>
      <h1>Welcome to The Midnight!</h1>
      <Flex width="80%">
        <Text>When you need an old car for rent, you tend to look at models that haven't been in production for decades. The Midnight lets you choose a car for your budget and occasion from a well-known brands. Customer friendly and multilingual support all over the World!</Text>
      </Flex>
    </PageContainer>
  );
};

export default Home;
