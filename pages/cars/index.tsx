import {
  View,
  Button,
  Flex,
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
  Header,
} from '@adobe/react-spectrum';
import { PageContainer } from '../../components/PageContainer';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { useState } from 'react';
import TableFilters from './components/tableFilters';
import { Car } from '../../types/Car';
import { CarFiltersType } from '../../types/UserForm';
import IndexPage from '../Head';
import { authOptions } from '../api/auth/[...nextauth]';

interface IndexCarsPageProps {
  cars: Car[];
}

export default async function Cars({ cars }: IndexCarsPageProps) {
  console.log(cars);

  const router = useRouter();
  const [showTableFilters, setShowTableFilters] = useState(false);
  //const [carData, setCarData] = useState<Car[]>(cars);
  const [noCars, setNoCars] = useState<boolean>(cars.length === 0);
  //const { data } = useSession();

  const columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Prod. year', uid: 'productionYear' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  async function fetchFilteredData(filtersData: CarFiltersType) {
    // let newUrl = '?';
    // if (filtersData.brand && filtersData.brand.length > 0) {
    //   newUrl += 'brand=' + filtersData.brand + '&';
    // }
    // if (filtersData.model && filtersData.model.length > 0) {
    //   newUrl += 'model=' + filtersData.model + '&';
    // }
    // if (filtersData.transmission.name.length > 0) {
    //   newUrl += 'transmission=' + filtersData.transmission.name + '&';
    // }
    // if (filtersData.productionYear.start > 1970) {
    //   newUrl += 'productionYearFrom=' + filtersData.productionYear.start + '&';
    // }
    // if (filtersData.productionYear.end < 2023) {
    //   newUrl += 'productionYearTo=' + filtersData.productionYear.end + '&';
    // }
    // if (filtersData.power.start > 80) {
    //   newUrl += 'powerFrom=' + filtersData.power.start + '&';
    // }
    // if (filtersData.power.end < 800) {
    //   newUrl += 'powerTo=' + filtersData.power.end + '&';
    // }
    // if (filtersData.capacity.start > 0) {
    //   newUrl += 'capacityFrom=' + filtersData.capacity.start + '&';
    // }
    // if (filtersData.capacity.end < 10) {
    //   newUrl += 'capacityTo=' + filtersData.capacity.end + '&';
    // }
    // if (filtersData.costPerDay.start > 50) {
    //   newUrl += 'costPerDayFrom=' + filtersData.costPerDay.start + '&';
    // }
    // if (filtersData.costPerDay.end < 1000) {
    //   newUrl += 'costPerDayTo=' + filtersData.costPerDay.end + '&';
    // }
    // if (filtersData.numberOfSeats.start > 2) {
    //   newUrl += 'numberOfSeatsFrom=' + filtersData.numberOfSeats.start + '&';
    // }
    // if (filtersData.numberOfSeats.end < 7) {
    //   newUrl += 'numberOfSeatsTo=' + filtersData.numberOfSeats.end + '&';
    // }
    // const url = new URL(window.location.href);
    // const pathname = url.pathname.slice(1) + newUrl.slice(0, -1);
    // if (pathname.length > 5) {
    //   window.history.pushState({}, null, pathname);
    //   const token = (await data).user ? (await data).user.token : '';
    //   await fetch(`${process.env.NEST_URL}${pathname}`, {
    //     mode: 'cors',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: 'Bearer ' + token,
    //     },
    //   })
    //     .then(res => {
    //       return res.json();
    //     })
    //     .then(data => {
    //       if (data.length > 0) {
    //         setCarData(data);
    //         setNoCars(false);
    //       } else {
    //         setNoCars(true);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // }
  }

  async function clearFiltersHandler() {
    // window.history.pushState({}, '', 'cars');
    // const token = (await data).user ? (await data).user.token : '';
    // await fetch(`${process.env.NEST_URL}cars`, {
    //   mode: 'cors',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + token,
    //   },
    // })
    //   .then(res => {
    //     return res.json();
    //   })
    //   .then(data => {
    //     if (data.length > 0) {
    //       setCarData(data);
    //       setNoCars(false);
    //     } else {
    //       setNoCars(true);
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  function selectCarHandler(keys: any) {
    router.push(`/cars/${keys.currentKey}`);
  }

  return (
    <PageContainer>
      <IndexPage />
      <h1>Available cars:</h1>
      <Flex direction="row" marginBottom="5px">
        <Button
          variant="primary"
          UNSAFE_style={{ cursor: 'pointer' }}
          onPress={e => setShowTableFilters(!showTableFilters)}
        >
          {showTableFilters === false ? 'Show filters' : 'Hide filters'}
        </Button>
      </Flex>
      {showTableFilters && (
        <View UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <TableFilters
            filtersHanlder={fetchFilteredData}
            clearFiltersHandler={clearFiltersHandler}
          />
        </View>
      )}
      {/* {carData.length > 0 && !noCars && (
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="100%"
          UNSAFE_className="cars-tablee"
          onSelectionChange={keys => selectCarHandler(keys)}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center">
                {column.name}
              </Column>
            )}
          </TableHeader>

          <TableBody items={carData}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
      )} */}
      {noCars && <Header>No cars available!</Header>}
    </PageContainer>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);
    console.log('', session);

    if (!session) throw new Error('Missing authenticated user!');
    const user = session?.user;
    const token = user.token || '';
    const cars = await getCars(token);

    return {
      props: {
        cars: cars,
        session,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: '/auth/signin',
        statusCode: 307,
      },
    };
  }
}

export async function getCars(token: string) {
  const response = await fetch(`${process.env.NEST_URL}/cars`, {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();

  return data;
}
