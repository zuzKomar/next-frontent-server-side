import type { NextPage } from 'next';
import Head from 'next/head';
import { PageContainer } from './components/PageContainer';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <PageContainer>
      <h1 className={styles.title}>Learn</h1>
    </PageContainer>
  );
};

export default Home;
