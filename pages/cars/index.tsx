import { GetServerSideProps } from 'next';
import { Cell, Column, Row, TableView, TableBody, TableHeader, View } from '@adobe/react-spectrum';
import { Flex } from '@adobe/react-spectrum';
import { PageContainer } from '../components/PageContainer';
import { useRouter } from 'next/router'

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
  data2: Car[];
}

export default function Cars({ data2 }: IndexCarsPageProps) {
  const router = useRouter();

  let usableCars = data2.filter((el:Car) => el.usable === true)

  let columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Year of production', uid: 'productionYear' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  function selectCarHandler(keys:any){
    router.push(`/cars/${keys.currentKey}`);
  }

  return (
    <PageContainer>
        <h1>Available cars:</h1>
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="70%"
          onSelectionChange={(keys)=>selectCarHandler(keys)}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center" width="auto">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={usableCars}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/cars');
  const data2 = await res.json();

  return { props: { data2 } };
};
