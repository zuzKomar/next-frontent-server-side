import { Flex, Item, TabList, TabPanels, Tabs } from '@adobe/react-spectrum';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const [currentLocation, setCurrentLocation] = useState('');

  useEffect(() => {
    if (window !== undefined) {
      if (window.location.pathname == '') {
        setCurrentLocation('home');
      } else if (window.location.pathname == '/cars') {
        setCurrentLocation('cars');
      } else if (window.location.pathname == '/rents') {
        setCurrentLocation('rents');
      }
    }
  }, []);

  return (
    <Flex justifyContent="center">
      <Tabs
        aria-label="navigation"
        density="compact"
        onSelectionChange={e => console.log(e)}
        selectedKey={currentLocation}
      >
        <TabList>
          <Item key="home">
            <Link href="/">
              <a>Home</a>
            </Link>
          </Item>
          <Item key="cars">
            <Link href="/cars">
              <a>Cars</a>
            </Link>
          </Item>
          <Item key="rents">
            <Link href="/rents">
              <a>Rents</a>
            </Link>
          </Item>
        </TabList>
      </Tabs>
    </Flex>
  );
};
