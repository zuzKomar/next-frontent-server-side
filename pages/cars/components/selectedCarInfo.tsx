import { Flex, TextField, View } from '@adobe/react-spectrum';
import React from 'react';
import { useState } from 'react';
import { CarPageProps } from '../../../types/CarPageProps';
import { Button } from '@adobe/react-spectrum';
import Car from '@spectrum-icons/workflow/Car';
import { Text } from '@adobe/react-spectrum';
import RentModal from './rentModal';
import { DialogTrigger } from '@adobe/react-spectrum';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const SelectedCarInfo = ({ data }: CarPageProps) => {
  const [open, setOpen] = useState(false);

  const photoPath = `/static/${data ? data.photo : ''}.png`;
  const session = useSession();
  const userId = session.data ? session.data.user.id : '';
  const token = session.data ? session.data.user.token : '';

  function handleCarRental(carId: number, userId: number, date: any, dueDate: any) {
    const createRentDto = {
      userId,
      carId,
      date:
        date.year +
        '-' +
        (date.month.toString().length === 1 ? '0' : '') +
        date.month +
        '-' +
        (date.day.toString().length === 1 ? '0' : '') +
        date.day +
        'T08:00:00.000Z',
      dueDate:
        dueDate.year +
        '-' +
        (dueDate.month.toString().length === 1 ? '0' : '') +
        dueDate.month +
        '-' +
        (dueDate.day.toString().length === 1 ? '0' : '') +
        dueDate.day +
        'T08:00:00.000Z',
    };

    fetch(`/api/rent-a-car`, {
      method: 'POST',
      body: JSON.stringify(createRentDto),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(e => console.log(e));
  }

  function handleCarAvailabilityCheck(carId: number, date: any, dueDate: any) {
    setOpen(true);
    const dateFrom =
      '' +
      date.year +
      '-' +
      (date.month.toString().length === 1 ? '0' + date.month : date.month) +
      '-' +
      (date.day.toString().length === 1 ? '0' + date.day : date.day) +
      'T08:00:00.000Z';
    const dateTo =
      '' +
      dueDate.year +
      '-' +
      (dueDate.month.toString().length === 1 ? '0' + dueDate.month : dueDate.month) +
      '-' +
      (dueDate.day.toString().length === 1 ? '0' + dueDate.day : dueDate.day) +
      'T08:00:00.000Z';
    //check if there are any rents in selected dates
    let isBooked = false;
    if (data.rents.length > 0) {
      for (const rent of data.rents) {
        if (
          (new Date(dateFrom) >= new Date(rent.date) &&
            new Date(dateFrom) <= new Date(rent.dueDate)) ||
          (new Date(dateTo) >= new Date(rent.date) && new Date(dateTo) <= new Date(rent.dueDate)) ||
          (new Date(dateFrom) <= new Date(rent.date) && new Date(dateTo) >= new Date(rent.date))
        ) {
          console.log('konflikt dat');
          isBooked = true;
        } else {
          console.log('brak konfliktu');
          isBooked = false;
        }
      }
    } else {
      isBooked = false;
    }

    return isBooked;
  }

  return (
    <View UNSAFE_style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} width="70%">
      <Flex direction="row" justifyContent="space-evenly">
        <Flex direction="column" gap="size-150" wrap>
          <TextField label="Brand" defaultValue={data ? data.brand : ''} isDisabled={true} />
          <TextField label="Model" defaultValue={data ? data.model : ''} isDisabled={true} />
          <TextField
            label="Production year"
            defaultValue={data ? data.productionYear + '' : ''}
            isDisabled={true}
          />
          <TextField label="Power" defaultValue={data ? data.power + '' : ''} isDisabled={true} />
          <TextField
            label="Capacity"
            defaultValue={data ? data.capacity + '' : ''}
            isDisabled={true}
          />
          <TextField
            label="Number of seats"
            defaultValue={data ? data.numberOfSeats + '' : ''}
            isDisabled={true}
          />
          <TextField
            label="Transmission"
            defaultValue={data ? data.transmission : ''}
            isDisabled={true}
          />
          <TextField
            label="Cost of rent per day"
            defaultValue={data ? data.costPerDay + '' : ''}
            isDisabled={true}
          />
        </Flex>
        <Flex direction="column" marginTop="20px">
          <Image src={photoPath} alt="car photo" style={{ width: '200px', height: '100px' }} />
          <DialogTrigger type="modal">
            <Button variant="primary" marginTop="20px" onPress={() => setOpen(true)}>
              <Car />
              <Text>Rent me!</Text>
            </Button>
            <RentModal
              carId={data ? data.id : 0}
              userId={userId || 0}
              costPerDay={data ? data.costPerDay : 0}
              closeHandler={setOpen}
              confirmHandler={handleCarRental}
              checkAvailabilityHandler={handleCarAvailabilityCheck}
            />
          </DialogTrigger>
        </Flex>
      </Flex>
    </View>
  );
};

export default SelectedCarInfo;
