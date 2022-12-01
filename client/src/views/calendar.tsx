import React, { useEffect, useId, useRef, useState } from 'react'
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
import { textColorOnHEXBg, eventTypeEnum } from '../utils/Utilities';
import { randomUUID } from 'crypto';
import moment from 'moment';
import { EventPopup } from '../components/EventPopup';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView() {
	const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
	const calendarRef = useRef<FullCalendar>(null);
	const [create] = useCreate();
	const [update] = useUpdate();
	const [_delete] = useDelete();
	const notify = useNotify();
	const [calendarValue, setCalendarValue] = useState(new Date());
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
	const [events, setEvents] = useState([] as EventInput[]);

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
				events.map((e:EventInput) => {
					e.start = e.start_date;
					e.end = e.end_date;
					e.allDay = e.all_day;
					e.textColor = textColorOnHEXBg(e.color);
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

	const shallowAddEvent = (event:EventInput) => {
		setEvents(current => [...current, event]);

		return event;
	}

	const shallowRemoveEvent = (eventId: string) => {
		let currEvents = events;
		currEvents = currEvents.filter(e => e.id != eventId);

		setEvents(currEvents);
	}

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
					rec.textColor = textColorOnHEXBg(rec.color);
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
				dataProvider.getTimelineData({id: data["id"]})
					.then((rec) => {
					rec.start = rec.start_date;
					rec.end = rec.end_date;
					rec.allDay = rec.all_day;
					rec.textColor = textColorOnHEXBg(rec.color);
					rec.title = rec.type != "j" ? eventTypeEnum[rec.type as keyof typeof eventTypeEnum] : rec.customer_descr;

					shallowAddEvent(rec);
					notify("Item succesfully created") //TODO: make locale dynamic
				})
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

	return (
		<div id="calendar-container" style={{
			margin: "30px 0"
		}}>
			<Box display="flex">
				<Box
					sx={{
						display: { xs: 'none', md: 'block' },
						order: -1,
						width: '17em',
						mr: 2,
						alignSelf: 'flex-start',
						height:"85vh",
					}}
				>
					<Card 
						sx={{
							overflowY: "auto",
							height: "85vh",
							marginTop: "10px"
						}}
					>
						<CardContent sx={{ pt: 1 }}>
							<Calendar 
								showFixedNumberOfWeeks={true}
								onChange={setCalendarValue} 
								value={calendarValue}
								onClickDay={(value) => {
									let calendar = calendarRef.current;
									calendar?.getApi().gotoDate(value)
								}}
								activeStartDate={moment(calendarValue).startOf('month').toDate()}
							/>
							<h4 style={{
								marginBottom: "0",
								padding: "0 6px",
								marginTop: "25px"
							}}>Calendars</h4>
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
				</Box>
				<Box width={isSmall ? 'auto' : 'calc(100% - 18em)'} height="85vh">
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
						  right: 'cloneWeek'
						}}
						eventMaxStack={5}
						initialView="timeGridWeek"
						customButtons={{
							cloneWeek: {
								text: "Clone prev. week",
								click: (ev, element) => {

									let calendar = calendarRef ? calendarRef.current : undefined,
										api = calendar ? calendar.getApi() : undefined,
										view = api ? api.view : undefined;

									let start = view ? moment(view.currentStart).subtract(7, 'd') : null,
										end = view ? moment(view.currentEnd).subtract(7, 'd') : null,
										startStr = start ? start.toISOString() : "",
										endStr = end ? end.toISOString() : "";

									let params = {
										"start": startStr,
										"end": endStr,
										"groups": "all"
									};
							
									//fetch events in start-7d,end-7d
									dataProvider.getTimelineData(params)
										.then((events) => {
											events.map((e:EventInput) => {
												delete e.id;

												e.start = moment(e.start_date).add(7, 'd').toDate();
												e.end = moment(e.end_date).add(7, 'd').toDate();
												e.start_date = e.start.toISOString();
												e.end_date = e.end.toISOString();
												e.allDay = e.all_day;
												e.textColor = textColorOnHEXBg(e.color);
												e.title = e.type != "j" ? eventTypeEnum[e.type as keyof typeof eventTypeEnum] : e.customer_descr;
							
												return new Promise((resolve, reject) => {
													create('event', {data: e}, {
														onError: (error) => {
															reject(error)
														},
														onSettled: (data, error) => {
															resolve(e);
														}
													});
												});
											})
							
											Promise.all(events).then((r) => {
												r.forEach((e) => {
													shallowAddEvent(e);
													notify("Events copied successfully.")
												})
											}).catch(e => {
												notify("Error while copying events")
											})
											
										})
										.catch(err => {
											console.error(err);
										});
								}
							}
						}}
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

							setCalendarValue(moment(dateInfo.start).add(moment(new Date()).weekday(), 'd').toDate());
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
							<EventPopup
								{...dialog}
								sanitizeEmptyValues
								resource="event"
								onSubmit={postSave}>
							</EventPopup>
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
					<EventPopup
						sanitizeEmptyValues
						record={popover.record}
						resource="event"
						onSubmit={eventEditSubmit}
						onRemoveClick={() => {
							_delete('event', { id: popover.record.id, previousData: popover.record }, {
								onError: (error) => {
									notify("Error on removing") //TODO: make locale dynamic
									console.error(error)
								},
								onSettled: (data, error) => {
									shallowRemoveEvent(popover.record.id)
									setPopover({
										open: false,
										record: null,
										anchorEl: null
									});
								},
							});
						}}>
					</EventPopup>
				</Box>
			</Popover>
		</div >
	)
}
