import { GetServerSideProps } from 'next';
import { Cell, Column, Row, TableView, TableBody, TableHeader, View } from '@adobe/react-spectrum';
import { Flex } from '@adobe/react-spectrum';
import { PageContainer } from '../components/PageContainer';

interface Car {
  id: number;
  brand: string;
  model: string;
  yearOfProduction: number;
  power: number;
  capacity: number;
  costPerDay: number;
}

interface IndexCarsPageProps {
  data2: Car[];
}

export default function Cars({ data2 }: IndexCarsPageProps) {
  let columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Year of production', uid: 'yearOfProduction' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  return (
    <PageContainer>
      <Flex direction="column" justifyContent="center" alignItems="center">
        <h1>Available cars:</h1>
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="70%"
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center" width="auto">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={data2}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
      </Flex>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/cars');
  const data2 = await res.json();

  return { props: { data2 } };
};
