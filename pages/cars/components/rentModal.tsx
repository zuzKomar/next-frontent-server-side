import { useState } from "react";
import {AlertDialog, Flex} from '@adobe/react-spectrum'
import {DatePicker} from '@adobe/react-spectrum'
import {parseDate} from '@internationalized/date';

type RentModalProps = {
 carId: number;
 userId: number;
 costPerDay: number;
 closeHandler: (open: boolean) => void
 confirmHandler: (carId: number, userId: number, date: string, dueDate: string) => void;
}

export const days = (date_1: Date, date_2: Date) => {
    let difference = date_1.getTime() - date_2.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
}


const RentModal = ({carId, userId, costPerDay, closeHandler, confirmHandler}: RentModalProps) => {
    let currentDate = new Date();
    const [date, setDate] = useState<string | any>(parseDate(new Date().toISOString().split('T')[0]));
    const [dueDate, setDueDate] = useState<string | any>(parseDate(new Date(Date.now() + (3600 * 1000 * 24)).toISOString().split('T')[0]));

    let costOfRent = costPerDay * days(new Date(dueDate), new Date(date));

    return (
        <AlertDialog 
            title="Pick rent time"
            primaryActionLabel="Rent"
            cancelLabel="Cancel"
            variant="confirmation"
            onCancel={() => closeHandler(false)}
            onPrimaryAction={() => confirmHandler(carId, userId, date, dueDate)}
        >
            Select suitable dates for rental period. Note that the minimal rent time is one full day (24h).
            <Flex direction="row" gap="size-200">
                <DatePicker label="Date from:" value={date} onChange={setDate}/>
                <DatePicker label="Date to:" value={dueDate} onChange={setDueDate}/>
            </Flex>
            { costOfRent > 0 &&
                <Flex direction='row' gap="size-100">
                    <p>Cost of rent:</p>
                    <p>{costOfRent + ' $'}</p>
                </Flex>
            }
        </AlertDialog>
    )
}

export default RentModal;