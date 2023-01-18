import { Flex, Item, TabList, Tabs } from '@adobe/react-spectrum';
import Link from 'next/link';
import {useRouter} from 'next/router';
import { useSession, signOut } from "next-auth/react"

export const Navbar = () => {
  const router = useRouter();
  let currentPath = router.pathname.split('/')[1];
  const { data: session, status: loading } = useSession()

  function logoutHandler(){
    signOut();
  }

  return (
    <Flex direction='row' justifyContent='space-around'>
      <Flex justifyContent="center" direction='column'> 
        {session &&
          <h2>{`Logged as ${session?.user?.name}`}</h2>
        }
        <Flex direction='row' justifyContent='space-around'>
          <Tabs
            aria-label="navigation"
            density="compact"
            selectedKey={currentPath}
          >
            <TabList>
              <Item key="">
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
          {session && 
            <button onClick={logoutHandler}>Sign out</button>
          }
        </Flex>
      </Flex>
    </Flex>
  );
};
