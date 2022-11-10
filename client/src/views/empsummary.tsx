import React from 'react';
import { useGetList, Datagrid, TextField, DateField, ReferenceField, NumberField, TextInput, List, DateInput, ReferenceInput, ReferenceArrayInput, SelectArrayInput } from 'react-admin';

const sort = { field: 'id', order: 'DESC' };
const postFilters = [
    <ReferenceArrayInput source="customer_id" reference="customer" alwaysOn >
        <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>,
    <ReferenceArrayInput source="employee_id" reference="employee" alwaysOn >
        <SelectArrayInput optionText="fullname" />
    </ReferenceArrayInput>
];

export default function EmployeeSummaryList() {
    const { data, total, isLoading } = useGetList('event', {
        pagination: { page: 1, perPage: 10 },
        sort,
    });

    return (
        <div>
            <List
                filters={postFilters}
            >
                <Datagrid
                    data={data}
                    total={total}
                    isLoading={isLoading}
                    sort={sort}
                    bulkActionButtons={false}
                >
                    <TextField source="id" />
                    <ReferenceField source="employee_id" reference="employee">
                        <TextField source="fullname" />
                    </ReferenceField>
                    <ReferenceField source="customer_id" reference="customer">
                        <TextField source="name" />
                    </ReferenceField>
                    <DateField source="start_date" showTime={true} />
                    <DateField source="end_date" showTime={true} />
                    <NumberField source="hours" />
                </Datagrid>
            </List>
        </div>
    );
};