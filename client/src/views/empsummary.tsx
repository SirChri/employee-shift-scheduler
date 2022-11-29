import { Card, CardContent } from '@mui/material';
import React from 'react';
import { useGetList, Datagrid, TextField, DateField, ReferenceField, NumberField, TextInput, List, DateInput, ReferenceInput, ReferenceArrayInput, SelectArrayInput, Loading, SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem, FunctionField, BooleanField } from 'react-admin';
import MailIcon from '@mui/icons-material/Mail';
import CategoryIcon from '@mui/icons-material/Category';
import { ColorField } from '../components/ColorInput';
import BadgeIcon from '@mui/icons-material/Badge';

const sort = { field: 'id', order: 'DESC' };
const postFilters = [
    <ReferenceArrayInput source="customer_id" reference="customer" alwaysOn >
        <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>,
    <ReferenceArrayInput source="employee_id" reference="employee" alwaysOn >
        <SelectArrayInput optionText="fullname" />
    </ReferenceArrayInput>
];

const listFilters = [
    <DateInput source="start_date_gte" alwaysOn />,
    <DateInput source="end_date_lte" alwaysOn />,
];

export default function EmployeeSummaryList() {
	const { data, total, isLoading, error } = useGetList(
		'employee',
        { 
            sort: { field: 'fullname', order: 'ASC' }
        }
	);
	if (isLoading) { return <Loading />; }
	if (error) { return <p>ERROR</p>; }

    const PostFilterSidebar = () => (
        <Card sx={{ order: -1, mr: 2, mt: 9, width: 200 }}>
            <CardContent>
                <SavedQueriesList />
                <FilterList label="Type" icon={<CategoryIcon />}>
                    <FilterListItem label="Job" value={{ type: 'j' }} />
                    <FilterListItem label="Permit" value={{ type: 'p' }} />
                    <FilterListItem label="Vacation" value={{ type: 'v' }} />
                    <FilterListItem label="Sickness" value={{ type: 's' }} />
                    <FilterListItem label="Makeup" value={{ type: 'm' }} />
                </FilterList>

                <FilterList label="Employee" icon={<BadgeIcon />}>
                    {data && data.map(function(el){
                        return <FilterListItem label={el.fullname} value={{ employee_id: el.id }} />;
                    })}
                </FilterList>

            </CardContent>
        </Card>
    );

    return (
        <div>
            <List resource='event' aside={<PostFilterSidebar />} filters={listFilters} sort={{ field: 'start_date', order: 'DESC' }}>
                <Datagrid bulkActionButtons={false}
                >
                    <DateField source="start_date" showTime={true} />
                    <DateField source="end_date" showTime={true} />
                    <ReferenceField source="employee_id" reference="employee">
                            <ColorField label="" source="color" />
                    </ReferenceField>
                    <ReferenceField source="employee_id" reference="employee">
                            <TextField source="fullname" />
                    </ReferenceField>
                    <TextField source="type" />
                    <ReferenceField source="customer_id" reference="customer">
                        <TextField source="name" />
                    </ReferenceField>
                    <FunctionField label="Hours" render={(record:any) => record && (record.all_day ? `All day` : record.hours)} />
                </Datagrid>
            </List>
        </div>
    );
};