import { Card, CardContent } from '@mui/material';
import React from 'react';
import { useGetList, Datagrid, TextField, DateField, ReferenceField, NumberField, TextInput, List, DateInput, ReferenceInput, ReferenceArrayInput, SelectArrayInput, Loading, SavedQueriesList, FilterLiveSearch, FilterList, FilterListItem, FunctionField, BooleanField } from 'react-admin';
import MailIcon from '@mui/icons-material/Mail';
import CategoryIcon from '@mui/icons-material/Category';
import { ColorField } from '../components/ColorInput';
import BadgeIcon from '@mui/icons-material/Badge';
import { downloadCSV } from 'react-admin';
import jsonExport from 'jsonexport/dist';

const sort = { field: 'id', order: 'DESC' };
const postFilters = [
    <ReferenceArrayInput source="customer_id" reference="customer" alwaysOn isRequired={true}>
        <SelectArrayInput optionText="name" />
    </ReferenceArrayInput>,
    <ReferenceArrayInput source="employee_id" reference="employee" alwaysOn isRequired={true}>
        <SelectArrayInput optionText="fullname" />
    </ReferenceArrayInput>
];

const listFilters = [
    <DateInput source="start_date_gte" alwaysOn/>,
    <DateInput source="end_date_lte" alwaysOn/>,
];

const exporter = (events:any) => {
    const columns = ['start_date', 'end_date', 'type', 'employee_fullname', 'customer_name', 'hours']
    
    events.map((ev: any) => {
        ev["employee_fullname"] = ev.employee.fullname;
        ev["customer_name"] = ev.customer.name;

        Object.keys(ev).forEach(key => {
            if (!columns.includes(key))
                delete ev[key]
        });
        return ev;
    });
    jsonExport(events, {
        headers: ['employee_fullname', 'customer_name', 'type', 'start_date', 'end_date', 'hours']
    }, (err, csv) => {
        downloadCSV(csv, 'events');
    });
};

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
            <List resource='event' aside={<PostFilterSidebar />} filters={listFilters} sort={{ field: 'start_date', order: 'DESC' }} exporter={exporter}>
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
