import { GetServerSidePropsContext } from 'next';
import { Cell, Column, Row, TableView, TableBody, TableHeader, View, Button, Flex } from '@adobe/react-spectrum';
import { PageContainer } from '../components/PageContainer';
import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { Session } from 'next-auth';
import { useState } from 'react'
import TableFilters from './components/tableFilters';
import { Car } from '../types/Car';

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
  const [seats, setSeats] = useState({start: 2, end: 7});
  // const [changedUrl, setChangedUrl] = useState('');
  const [carsData, setCarsData] = useState(cars);
  const { data } = useSession();

  let columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Prod. year', uid: 'productionYear' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  function fetchFilteredData(){
    router.push({
      pathname: '/cars',
      query: {
        brand : brand.length > 0 ? brand : [],
        model : model.length > 0 ? model: [],
        transmission: transmission.length > 0 ? transmission : [],
        productionYearFrom : productionYears.start > 1970 ? productionYears.start: [],
        productionYearTo: productionYears.end < 2023 ? productionYears.end: [],
        powerFrom: powerHorses.start > 80 ? powerHorses.start: [],
        powerTo : powerHorses.end < 800 ? powerHorses.end: [],
        capacityFrom : capacity.start > 0 ? capacity.start: [],
        capacityTo: capacity.end < 10 ? capacity.end: [],
        costPerDayFrom: costPerDay.start > 50 ? costPerDay.start : [],
        costPerDayTo: costPerDay.end < 1000 ? costPerDay.end : [],
        numberOfSeatsFrom: seats.start > 2 ? seats.start : [],
        numberOfSeatsTo: seats.end < 7 ? seats.end : []
      }
    });
    const url = new URL(window.location.href);
    let pathname = url.pathname.slice(1) + url.search;
    window.history.pushState({}, '', url.toString());
    let token = data.user ? data.user.accessToken : '';

    fetch(`http://localhost:3000/${pathname}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((res) => {
      return res.json();
    }).then((data) => {
      setCarsData(data)});
  }

  function selectCarHandler(keys:any){
    router.push(`/cars/${keys.currentKey}`);
  }

  return (
    <PageContainer>
        <h1>Available cars:</h1>
        <Flex direction='row' marginBottom="5px">
            <Button variant='primary' UNSAFE_style={{cursor: 'pointer'}} onPress={()=> setShowTableFilters(!showTableFilters)}>{showTableFilters === false ? 'Show filters' : 'Hide filters'}</Button>
        </Flex>
        {showTableFilters &&
          <View UNSAFE_style={{'backgroundColor': 'rgba(0,0,0,0.5)'}}>
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
                seatsValue={seats}
                setSeatsValue={setSeats}
                useFiltersHanlder={fetchFilteredData}
                />
          </View>
        }
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="100%"
          onSelectionChange={(keys)=>selectCarHandler(keys)}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={carsData}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session: Session | null = await getSession({req: context.req});
   
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