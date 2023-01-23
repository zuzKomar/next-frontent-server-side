import { GetServerSidePropsContext } from 'next';
import { Cell, Column, Row, TableView, TableBody, TableHeader, View, Button, Flex } from '@adobe/react-spectrum';
import { PageContainer } from '../components/PageContainer';
import { useRouter } from 'next/router'
import { getSession } from "next-auth/react";
import { Session } from 'next-auth';
import { useState, useEffect } from 'react'
import TableFilters from './components/tableFilters';
// import "next-auth"

export interface Car {
  id: number;
  brand: string;
  model: string;
  productionYear: number;
  power: number;
  capacity: number;
  costPerDay: number;
  numberOfSeats: number;
  transmission: string;
  photo: string;
  usable: boolean;
  rents: any[];
}

interface IndexCarsPageProps {
  cars: Car[];
}

export default function Cars({ cars }: IndexCarsPageProps) {
  const router = useRouter();
  const [showTableFilters, setShowTableFilters] = useState(false)
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [productionYears, setProductionYears] = useState({start: 1970, end: 2023})
  const [powerHorses, setPowerHorses] = useState({start: 80, end: 800})
  const [capacity, setCapacity] = useState({start: 0, end: 10})
  const [costPerDay, setCostPerDay] = useState({start: 50, end: 1000})

  let columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Prod. year', uid: 'productionYear' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  useEffect(() => {
    


  }, [brand, model, transmission, productionYears, powerHorses, capacity, costPerDay])

  function selectCarHandler(keys:any){
    router.push(`/cars/${keys.currentKey}`);
  }

  return (
    <PageContainer>
        <h1>Available cars:</h1>
        <Flex direction='row' marginBottom="5px">
            <Button variant='primary' onPress={()=> setShowTableFilters(!showTableFilters)}>{showTableFilters === false ? 'Show filters' : 'Hide filters'}</Button>
        </Flex>
        {showTableFilters &&
          <View>
            <TableFilters 
                transmissionValue={transmission} 
                setTransmissionValue={setTransmission}
                brandValue={brand}
                setBrandValue={setBrand}
                modelValue={model}
                setModelValue={setModel}
                productionYearsValue={productionYears}
                setProductionYearsValue={setProductionYears}
                powerHorsesValue={powerHorses}
                setPowerHorsesValue={setPowerHorses}
                capacityValue={capacity}
                setCapacityValue={setCapacity}
                costPerDayValue={costPerDay}
                setCostPerDayValue={setCostPerDay}
                />
          </View>
        }
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="60%"
          onSelectionChange={(keys)=>selectCarHandler(keys)}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={cars}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session: Session | null = await getSession({req: context.req});
    console.log('session', session);
    if(!session) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false
        }
      }
    }else {
      const token = session!.user!.accessToken || '';
      const cars = await getCars(token!);

      return { 
        props: { 
          cars: cars
        } 
      }
    }
  }catch(err){
    console.log(err);
  }
}

export async function getCars(token: string) {
  const response = await fetch(`${process.env.NEST_URL}cars`, 
  {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  return data;
}