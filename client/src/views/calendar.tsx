import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGrid from '@fullcalendar/timegrid' // a plugin!
import { Box, Chip, useMediaQuery, Theme, Card, CardContent } from '@mui/material';
import { dataProvider } from '../dataProvider'
import interactionPlugin from '@fullcalendar/interaction';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { SimpleForm, TextInput, required, ReferenceInput, SelectInput, DateTimeInput, useNotify, useCreate, useUpdate } from 'react-admin';
import Fab from '@mui/material/Fab';
import { Tooltip, Typography } from '@mui/material';
import ReactDOM from 'react-dom/client';
import BadgeIcon from '@mui/icons-material/Badge';

const divStyle = {
	width: "100%",
	height: "100%",
};

export default function CalendarView() {
	const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
	const calendarRef = useRef(null);
	const [create] = useCreate();
	const [update] = useUpdate();
	const notify = useNotify();
	const [open, setOpen] = useState(false);
	const [props, setProps] = useState<any>({
		record: undefined
	});

	useEffect(() => {
		calendarRef.current;
		
	});

	const postSave = (data: any) => {
		if (!props || !props.record) {
			create('agenda', { data }, {
				onError: (error) => {
					notify("Error on creation") //TODO: make locale dynamic
					console.error(error)
				},
				onSettled: (data, error) => {
					handleClose();
					notify("Item succesfully created") //TODO: make locale dynamic
				},
			});
		} else {
			const recId = props.record["id"];
			update('agenda', { id: recId, data: data }, {
				onError: (error) => {
					notify("Error on updating") //TODO: make locale dynamic
					console.error(error)
				},
				onSettled: (data, error) => {
					handleClose();
					notify("Item updated") //TODO: make locale dynamic
				},
			})
		}
	}

	const handleClose = () => {
		setOpen(false)
		setProps({})
	}

	const handleOpen = (record: any = null) => {
		if (record && record.id) {
			setProps({
				record: {
                    id: record.id,
                    start_date: record.start_date,
                    end_date: record.end_date,
                    employee_id: record.employee_id,
                    customer_id: record.customer_id
                }
			})
		} else {
			setProps({})

		}

		setOpen(true)
	}

    return (
		<div id="calendar-container" style={{
			margin: "30px 0"
		}}>
			<Box display="flex">
				<Card
					sx={{
						display: { xs: 'none', md: 'block' },
						order: -1,
						width: '15em',
						mr: 2,
						alignSelf: 'flex-start',
					}}
				>
					<CardContent sx={{ pt: 1 }}>

					</CardContent>
				</Card>
				<Box width={isSmall ? 'auto' : 'calc(100% - 16em)'} height="85vh">
				<FullCalendar
					ref={calendarRef}
					locale="it"
					height="100%"
					slotMinTime="05:00:00"
					slotMaxTime="22:00:00"
					plugins={[ timeGrid, interactionPlugin ]}
					initialView="timeGridWeek"
					eventClick={(info) => {
						console.log("aaa ", info);
					}}
					eventChange={(info) => {
						const item = info.event.toJSON();
						const recId = item["id"];
						let data = {
							id: recId,
							start_date: item.start,
							end_date: item.end,
							employee_id: item.extendedProps.employee_id
						}
		
						update('agenda', { id: recId, data: data }, {
							onError: (error) => {
								notify("Error on updating") //TODO: make locale dynamic
								console.error(error)
							},
							onSettled: (data, error) => {
								notify("Item updated") //TODO: make locale dynamic
							}
						})
					}}
					editable={true}
					eventSources={[{
						events: function(info, successCallback, failureCallback) {
							let params = {
								"start": info.start.toISOString(),
								"end": info.end.toISOString(),
								"groups": "all"
							};

							dataProvider.getTimelineData(params)
								.then((data) => successCallback(data))
								.catch(err => failureCallback(err));
							},
						success: (events:Array<any>) => {
							events.forEach(e => {
								e.start = e.start_date;
								e.end = e.end_date;
								e.title = e.customer_descr;
							})
							
							return events;
						}
					  }]}
				/>
				<Dialog
					open={open}
					onClose={handleClose}
				>
					<Box>
						<SimpleForm
							{...props}
							resource="agenda"
							onSubmit={postSave}>
							<DateTimeInput source="start_date" label="Data inizio" />
							<DateTimeInput source="end_date" label="Data fine" />
							<ReferenceInput source="employee_id" reference="employee" label="Employee">
								<SelectInput optionText="fullname" />
							</ReferenceInput>
							<ReferenceInput source="customer_id" reference="customer" label="Customer">
								<SelectInput optionText="name" />
							</ReferenceInput>
						</SimpleForm>
					</Box>
				</Dialog>
				<Fab color="primary" aria-label="add" style={{
					right: 20,
					position: 'fixed',
					bottom: 10
				}} onClick={handleOpen}>
					<AddIcon />
				</Fab>
				</Box>
			</Box>
		</div>
    )
}
