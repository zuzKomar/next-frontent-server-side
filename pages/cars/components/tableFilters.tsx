import { ComboBox, Flex, Item, RangeSlider, TextField } from "@adobe/react-spectrum";
import React from "react";

type TableFiltersType = {
    brandValue: string;
    setBrandValue: (value: string) => void;
    modelValue: string;
    setModelValue: (value: string) => void;
    transmissionValue: string;
    setTransmissionValue: (value: string) => void;
    productionYearsValue: {start: number, end: number};
    setProductionYearsValue: ({start, end}) => void;
    powerHorsesValue: {start: number, end: number};
    setPowerHorsesValue: ({start, end}) => void;
    capacityValue: {start: number, end: number};
    setCapacityValue: ({start, end}) => void;
    costPerDayValue: {start: number, end: number};
    setCostPerDayValue: ({start, end}) => void;
}

const TableFilters = ({transmissionValue, 
                        setTransmissionValue,
                        brandValue,
                        setBrandValue,
                        modelValue, 
                        setModelValue,
                        productionYearsValue,
                        setProductionYearsValue,
                        powerHorsesValue,
                        setPowerHorsesValue,
                        capacityValue,
                        setCapacityValue,
                        costPerDayValue, 
                        setCostPerDayValue
                        }: TableFiltersType) =>{

    const transmissionOptions = [
        {id: 0, name: ''},
        {id: 1, name: 'MANUAL'},
        {id: 2, name: 'AUTOMATIC'},
    ]

    const seatsOptions = [
        {id: 1, name: 2},
        {id: 2, name: 5},
        {id: 3, name: 7} 
    ];
     
    return (
        <Flex direction='column'>
            <Flex direction='row' gap="size-150" wrap marginBottom="10px">
                <TextField
                    label="Brand:"
                    value={brandValue}
                    onChange={setBrandValue} />

                <TextField
                    label="Model:"
                    value={modelValue}
                    onChange={setModelValue} />

                <ComboBox
                    label="Transmission type"
                    defaultItems={transmissionOptions}
                    defaultSelectedKey={0}
                    inputValue={transmissionValue}
                    onInputChange={setTransmissionValue}
                >
                    {item => <Item>{item.name}</Item>}
                </ComboBox>
            </Flex>
            <Flex direction='row' gap="size-150" wrap >
                <RangeSlider
                    label="Prod. year:"
                    minValue={1970}
                    maxValue={2023}
                    value={productionYearsValue}
                    onChange={setProductionYearsValue}
                    formatOptions={{style: 'decimal'}}
                />

                <RangeSlider
                    label="Power horses: "
                    minValue={80}
                    maxValue={800}
                    value={powerHorsesValue}
                    onChange={setPowerHorsesValue}
                    formatOptions={{style: 'decimal'}}
                />

                <RangeSlider
                    label="Capacity:"
                    minValue={0.0}
                    maxValue={10.0}
                    value={capacityValue}
                    onChange={setCapacityValue}
                    formatOptions={{style: 'decimal'}}
                />
            </Flex>
            <Flex direction='row' gap="size-150" wrap marginBottom="5px">
                <ComboBox
                        label="Number of seats:"
                        defaultItems={seatsOptions}
                        defaultSelectedKey={1}
                        inputValue={''}
                        onInputChange={setTransmissionValue}
                    >
                        {item => <Item>{item.name}</Item>}
                </ComboBox>
                <RangeSlider
                    label="Cost/day:"
                    minValue={50}
                    maxValue={1000}
                    value={costPerDayValue}
                    onChange={setCostPerDayValue}
                    formatOptions={{style: 'decimal'}}
                />
            </Flex>
        </Flex>
    )
}

export default TableFilters;