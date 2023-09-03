import { GetServerSidePropsContext } from 'next';
import { View, Button, Flex, TableView, TableHeader, Column, TableBody, Row, Cell, Header } from '@adobe/react-spectrum';
import { PageContainer } from '../components/PageContainer';
import { useRouter } from 'next/router'
import { getSession, useSession } from "next-auth/react";
import { Session } from 'next-auth';
import { useState } from 'react'
import TableFilters from './components/tableFilters';
import { Car } from '../types/Car';
import IndexPage from '../Head';

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
  const [horsePower, setHorsePower] = useState({start: 80, end: 800})
  const [capacity, setCapacity] = useState({start: 0, end: 10})
  const [costPerDay, setCostPerDay] = useState({start: 50, end: 1000})
  const [seats, setSeats] = useState({start: 2, end: 7});
  const [carData, setCarData] = useState<any[]>([...cars]);
  const [noCars, setNoCars] = useState<boolean>(cars.length === 0);
  const { data } = useSession();

  let columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Prod. year', uid: 'productionYear' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  async function fetchFilteredData(){
    let newUrl = '?';

    if (brand.length > 0){
      newUrl += 'brand=' + brand + '&';
    }
    if (model.length > 0){
      newUrl += 'model=' + model + '&';;
    }
    if (transmission.length > 0){
      newUrl += 'transmission=' + transmission + '&';;
    } 
    if (productionYears.start > 1970){
      newUrl += 'productionYearFrom=' + productionYears.start + '&';;
    }
    if (productionYears.end < 2023){
      newUrl += 'productionYearTo=' + productionYears.end + '&';;
    }
    if (horsePower.start > 80){
      newUrl += 'powerFrom=' + horsePower.start + '&';;
    }
    if (horsePower.end < 800){
      newUrl += 'powerTo=' + horsePower.end + '&';;
    }
    if (capacity.start > 0){
      newUrl += 'capacityFrom=' + capacity.start + '&';;
    }
    if (capacity.end < 10){
      newUrl += 'capacityTo=' + capacity.end + '&';;
    }
    if (costPerDay.start > 50){
      newUrl += 'costPerDayFrom=' + costPerDay.start + '&';;
    }
    if (costPerDay.end < 1000){
      newUrl += 'costPerDayTo=' + costPerDay.end + '&';;
    }
    if (seats.start > 2){
      newUrl += 'numberOfSeatsFrom=' + seats.start + '&';;
    }
    if (seats.end < 7){
      newUrl += 'numberOfSeatsTo=' + seats.end + '&';;
    }

    const url = new URL(window.location.href);
    let pathname = url.pathname.slice(1) + newUrl.slice(0, -1);

    if(pathname.length > 5){
      let token = data.user ? data.user.accessToken : '';

     await fetch(`http://localhost:3000/${pathname}`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then((res) => {
        console.log(res.json());
        return res.json();
      }).then((data) => {
        if(data.length > 0){
          setCarData(data);
          setNoCars(false);
        }else {
          setNoCars(true);
        }
       
        window.history.pushState({}, '', url.toString());
      })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async function clearFiltersHandler() {
    const url = new URL(window.location.href);
    let token = data.user ? data.user.accessToken : '';
    
    await fetch(`http://localhost:3000/cars`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then((res) => {
      return res.json();
    }).then((data) => {
      if(data.length > 0){
        setCarData(data);
        setNoCars(false);
      }else {
        setNoCars(true);
      }
     
      window.history.pushState({}, '', url.toString());
    })
      .catch((err) => {
        console.log(err);
      });
  }

  function selectCarHandler(keys:any){
    router.push(`/cars/${keys.currentKey}`);
  }

  return (
    <PageContainer>
      <IndexPage />
        <h1>Available cars:</h1>
        <Flex direction='row' marginBottom="5px">
            <Button variant='primary' UNSAFE_style={{cursor: 'pointer'}} onPress={(e)=> setShowTableFilters(!showTableFilters)}>{showTableFilters === false ? 'Show filters' : 'Hide filters'}</Button>
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
                powerHorsesValue={horsePower}
                setPowerHorsesValue={setHorsePower}
                capacityValue={capacity}
                setCapacityValue={setCapacity}
                costPerDayValue={costPerDay}
                setCostPerDayValue={setCostPerDay}
                seatsValue={seats}
                setSeatsValue={setSeats}
                useFiltersHanlder={fetchFilteredData}
                clearFiltersHandler={clearFiltersHandler}
                />
          </View>
        }
        {(carData.length > 0 && !noCars) &&
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="100%"
          UNSAFE_className='cars-tablee'
          onSelectionChange={(keys)=>selectCarHandler(keys)}
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
      }
      {noCars &&
        <Header>No cars available!</Header>
      }
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