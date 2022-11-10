import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import { EventInput } from '@fullcalendar/react';
import timeGrid from '@fullcalendar/timegrid' // a plugin!
import dayGrid from '@fullcalendar/daygrid'
import { Box, Chip, useMediaQuery, Theme, Card, CardContent, Checkbox, Typography, IconButton } from '@mui/material';
import { dataProvider } from '../dataProvider'
import interactionPlugin from '@fullcalendar/interaction';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { SimpleForm, TextInput, required, ReferenceInput, SelectInput, DateTimeInput, useNotify, useCreate, useUpdate, useGetList, Loading, FormDataConsumer } from 'react-admin';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircleIcon from '@mui/icons-material/Circle';
import { group } from 'console';
import { textColorOnHEXBg, eventTypeEnum } from '../utils/Utilities';

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
	const [unchecked, setUnchecked] = React.useState([] as number[]);

	const { data, total, isLoading, error } = useGetList(
		'employee'
	);
	if (isLoading) { return <Loading />; }
	if (error) { return <p>ERROR</p>; }

	const postSave = (data: any) => {
		if (!props || !props.record || !props.record["id"]) {
			data.customer_id = data.customer_id === "" ? null : data.customer_id;
			create('event', { data }, {
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
			data.customer_id = data.customer_id === "" ? null : data.customer_id;
			update('event', { id: recId, data: data }, {
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

	const handleToggle = (value: number) => () => {
		const currentIndex = unchecked.indexOf(value);
		const newUnchecked = [...unchecked];

		if (currentIndex === -1) {
			newUnchecked.push(value);
		} else {
			newUnchecked.splice(currentIndex, 1);
		}

		setUnchecked(newUnchecked);
	};

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
				<Box
					sx={{
						display: { xs: 'none', md: 'block' },
						order: -1,
						width: '15em',
						mr: 2,
						alignSelf: 'flex-start',
						height:"85vh",
					}}
				>
					<Card 
						sx={{
							overflowY: "auto",
							height: "55vh"
						}}
					>
						<CardContent sx={{ pt: 1 }}>
							<nav aria-label="main">
								<List>
									{data!.map(record => {
										const labelId = `checkbox-list-label-${record.id}`;
										return (
											<ListItem disablePadding key={record.id}>
												<ListItemButton role={undefined} onClick={handleToggle(record.id)} dense>
													<ListItemIcon>
														<Checkbox
															edge="start"
															checked={unchecked.indexOf(record.id) === -1}
															tabIndex={-1}
															disableRipple
															style ={{
																color: record.color,
															}}
															inputProps={{ 'aria-labelledby': labelId }}
														/>
													</ListItemIcon>
													<ListItemText
														id={labelId}
														primary={record.fullname}
														secondary={"Matricola: " + record.number} />
												</ListItemButton>
											</ListItem>
										)
									}
									)}
								</List>
							</nav>
						</CardContent>
					</Card>
					<Card
						sx={{
							overflowY: "auto",
							height: "27vh",
							marginTop: "25px"
						}}
						>
						<CardContent sx={{ pt: 1 }}>
							<nav aria-label="secondary">
							<List>
								<ListItem
									secondaryAction={
										<IconButton edge="end" aria-label="delete">
										  <CircleIcon />
										</IconButton>
									  }>
									<ListItemText
									primary="Single-line item"
									/>
								</ListItem>
								<ListItem>
									<ListItemText
									primary="Single-line item"
									/>
								</ListItem>
							</List>
							</nav>
						</CardContent>
					</Card>
				</Box>
				<Box width={isSmall ? 'auto' : 'calc(100% - 16em)'} height="85vh">
					<FullCalendar
						ref={calendarRef}
						locale="it"
						height="100%"
						selectable={true}
						slotMinTime="05:00:00"
						slotMaxTime="22:00:00"
						plugins={[timeGrid, dayGrid, interactionPlugin]}
						headerToolbar= {{
						  left: 'prev,next today',
						  center: 'title',
						  right: 'dayGridMonth,timeGridWeek,timeGridDay',
						}}
						initialView="timeGridWeek"
						select={(info) => {
							setProps({
								record: {
									start_date: info.startStr,
									end_date: info.endStr
								}
							})

							setOpen(true)
						}}
						eventClick={(info) => {
							const item = info.event.toJSON();
							setProps({
								record: {
									id: item.id,
									start_date: item.start,
									end_date: item.end,
									employee_id: item.extendedProps.employee_id,
									customer_id: item.extendedProps.customer_id
								}
							})

							setOpen(true)
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

							update('event', { id: recId, data: data }, {
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
							events: function (info, successCallback, failureCallback) {
								let groups = data!.map(e => e.id);
								groups = groups.filter(g => !unchecked.includes(g))

								let params = {
									"start": info.start.toISOString(),
									"end": info.end.toISOString(),
									"groups": unchecked.length > 0 ? groups : "all"
								};

								dataProvider.getTimelineData(params)
									.then((data) => successCallback(data))
									.catch(err => failureCallback(err));
							},
							success: (events: Array<any>) => {
								events.forEach(e => {
									e.start = e.start_date;
									e.end = e.end_date;
									e.textColor = textColorOnHEXBg(e.color),
									e.title = e.type != "j" ? eventTypeEnum[e.type as keyof typeof eventTypeEnum] : e.customer_descr;
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
							<Typography variant="h6" sx={{
								padding: "10px 20px"
							}}>
								{props.record && props.record["id"] ? "Modifica evento" : "Crea evento"}
							</Typography>
							<SimpleForm
								shouldUnregister
								sanitizeEmptyValues
								{...props}
								resource="event"
								onSubmit={postSave}>
								<DateTimeInput source="start_date" label="Data inizio" />
								<DateTimeInput source="end_date" label="Data fine" />
								<SelectInput source="type" choices={
									Object.entries(eventTypeEnum).map(([id, name]) => ({id,name}))
								} 
								defaultValue="j"/>
								<ReferenceInput source="employee_id" reference="employee" label="Employee">
									<SelectInput optionText="fullname" />
								</ReferenceInput>
								<FormDataConsumer>
								{({ formData, ...rest }) => formData.type === "j" &&
									<ReferenceInput 
									source="customer_id" 
									reference="customer" 
									label="Customer">
										<SelectInput optionText="name" />
									</ReferenceInput>
								}
							</FormDataConsumer>
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
		</div >
	)
}
