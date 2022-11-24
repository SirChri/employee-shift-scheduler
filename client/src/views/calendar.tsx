import React, { useEffect, useRef, useState } from 'react'
import FullCalendar, { EventContentArg } from '@fullcalendar/react' // must go before plugins
import { EventInput } from '@fullcalendar/react';
import timeGrid from '@fullcalendar/timegrid' // a plugin!
import dayGrid from '@fullcalendar/daygrid'
import { Box, Chip, useMediaQuery, Theme, Card, CardContent, Checkbox, Typography, IconButton, Popover, Button } from '@mui/material';
import { dataProvider } from '../dataProvider'
import interactionPlugin from '@fullcalendar/interaction';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { SimpleForm, TextInput, required, ReferenceInput, SelectInput, DateTimeInput, useNotify, useCreate, useUpdate, useGetList, Loading, FormDataConsumer, BooleanInput, useDelete } from 'react-admin';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
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
	const [_delete] = useDelete();
	const notify = useNotify();
	const [dialog, setDialog] = useState<any>({
		open: false,
		record: undefined
	});
	const [window, setWindow] = useState<any>({
		start: null,
		end: null
	})

	const [popover, setPopover] = useState<any>({
		open: false,
		record: undefined,
		anchorEl: null
	})

	const [unchecked, setUnchecked] = useState([] as number[]);
	const [events, setEvents] = useState([] as any);

	const { data, total, isLoading, error } = useGetList(
		'employee'
	);

	// load events
	useEffect(() => {
		if (!data || !window.start)
			return;

		let groups = data!.map(e => e.id);
		groups = groups.filter(g => !unchecked.includes(g))

		let params = {
			"start": window.start,
			"end": window.end,
			"groups": unchecked.length > 0 ? groups : "all"
		};

		dataProvider.getTimelineData(params)
			.then((events) => {
				events.map((e:any) => {
					e.start = e.start_date;
					e.end = e.end_date;
					e.allDay = e.all_day;
					e.textColor = textColorOnHEXBg(e.color),
					e.title = e.type != "j" ? eventTypeEnum[e.type as keyof typeof eventTypeEnum] : e.customer_descr;

					return e;
				})

				//TODO: improve merge capabilities
				setEvents(events);
			})
			.catch(err => {
				console.error(err);
			});
	}, [window, data, unchecked])

	if (isLoading) { return <Loading />; }
	if (error) { return <p>ERROR</p>; }

	const eventEditSubmit = (data:any) => {
		const recId = popover.record["id"];
		data.customer_id = data.customer_id === "" ? null : data.customer_id;
		update('event', { id: recId, data: data }, {
			onError: (error) => {
				notify("Error on updating") //TODO: make locale dynamic
				console.error(error)
			},
			onSettled: (data, error) => {
				// 1. Make a shallow copy of the items
				let items = [...events];
				items = items.filter(it => it.id != popover.record["id"]);
				
				dataProvider.getTimelineData({id: popover.record["id"]})
					.then((rec) => {
					rec.start = rec.start_date;
					rec.end = rec.end_date;
					rec.allDay = rec.all_day;
					rec.textColor = textColorOnHEXBg(rec.color),
					rec.title = rec.type != "j" ? eventTypeEnum[rec.type as keyof typeof eventTypeEnum] : rec.customer_descr;

					items.push(rec);
					setEvents(items);
					notify("Item updated") //TODO: make locale dynamic

					setPopover({
						open: false,
						record: null,
						anchorEl: null
					});
				})
			},
		})
	}

	const postSave = (data: any) => {
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
		setDialog({
			open: false,
			record: {}
		})
	}

	const handleOpen = (record: any = null) => {
		let props: any = {
			open: true
		}
		if (record && record.id) {
			props["record"] = record;
		} 

		setDialog(props)
	}
	console.log("render");
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
							setDialog({
								open: true,
								record: {
									start_date: info.startStr,
									end_date: info.endStr,
									all_day: info.allDay || false
								}
							})
						}}
						eventRemove={(info) => {
							const item = info.event.toJSON();
							_delete('event', item.id, {
								onError: (error) => {
									notify("Error on deleting") //TODO: make locale dynamic
									console.error(error)
								},
								onSettled: (data, error) => {
									notify("Item removed") //TODO: make locale dynamic
								},
							});
						}}
						eventContent={(eventContent: EventContentArg) => {
							if (eventContent.timeText)
								return (
									<>
									{eventContent.timeText} <br />
									<i>{eventContent.event.title}</i>
									</>
								)

							return (
								<>
								<i>{eventContent.event.title}</i>
								</>
							)
						}}

						eventClick={(info) => {
							const item = info.event.toJSON();

							setPopover({
								open: true,
								anchorEl: info.el,
								record: {
									id: item.id,
									start_date: item.start,
									all_day: item.extendedProps.all_day,
									end_date: item.end,
									type: item.extendedProps.type,
									employee_id: item.extendedProps.employee_id,
									customer_id: item.extendedProps.customer_id									
								}
							})
						}}
						eventChange={(info) => {
							const item = info.event.toJSON();
							const recId = item["id"];
							let data = {
								id: recId,
								start_date: item.start,
								type: item.extendedProps.type,
								end_date: item.end,
								employee_id: item.extendedProps.employee_id,
								customer_id: item.extendedProps.customer_id
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
						events={events}
						datesSet={(dateInfo) => {
							setWindow({
								start: dateInfo.start.toISOString(),
								end: dateInfo.end.toISOString()
							})
						}}
					/>
					<Dialog
						open={dialog.open}
						onClose={handleClose}
					>
						<Box>
							<Typography variant="h6" sx={{
								padding: "10px 20px"
							}}>
								{"Crea evento"}
							</Typography>
							<SimpleForm
								{...dialog}
								sanitizeEmptyValues
								resource="event"
								onSubmit={postSave}>
								<BooleanInput source="all_day" label="Tutto il giorno" />
								<DateTimeInput source="start_date" label="Data inizio" />
								<DateTimeInput source="end_date" label="Data fine" />
								<SelectInput source="type" choices={
									Object.entries(eventTypeEnum).map(([id, name]) => ({id,name}))
								} 
								defaultValue="j"/>
								<ReferenceInput source="employee_id" reference="employee" label="Employee"  validate={required()} >
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
			<Popover
				open={popover.open}
				anchorEl={popover.anchorEl}
				onClose={() => {
					setPopover({
						open: false,
						record: null,
						anchorEl: null
					});
				}}
				anchorOrigin={{
				  vertical: 'bottom',
				  horizontal: 'left',
				}}
				transformOrigin={{
				  vertical: 'center',
				  horizontal: 'right',
				}}
			>
				<Box>
					<Typography variant="h6" sx={{
						padding: "10px 20px"
					}}>
						{popover.record && popover.record["id"] ? "Modifica evento" : "Crea evento"}
					</Typography>
					<SimpleForm
						sanitizeEmptyValues
						record={popover.record}
						resource="event"
						onSubmit={eventEditSubmit}>
						<BooleanInput source="all_day" label="Tutto il giorno" />
						<DateTimeInput source="start_date" label="Data inizio" />
						<DateTimeInput source="end_date" label="Data fine" />
						<SelectInput source="type" choices={
							Object.entries(eventTypeEnum).map(([id, name]) => ({id,name}))
						} 
						defaultValue="j"/>
						<ReferenceInput source="employee_id" reference="employee" label="Employee"  validate={required()} >
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
			</Popover>
		</div >
	)
}
