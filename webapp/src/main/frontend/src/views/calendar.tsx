import * as React from "react";
import { EventChangeArg, EventContentArg, EventInput } from '@fullcalendar/core';
import dayGrid from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGrid from '@fullcalendar/timegrid'; // a plugin!
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, CardContent, Checkbox, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, Popover, Radio, RadioGroup, Theme, useMediaQuery } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Loading, useCreate, useDelete, useGetList, useLocaleState, useNotify, useTranslate, useUpdate } from 'react-admin';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { EventPopup } from '../components/EventPopup';
import { dataProvider } from '../dataProvider';
import { textColorOnHEXBg } from '../utils/Utilities';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';


export default function CalendarView() {
	const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    const translate = useTranslate();
	const [locale] = useLocaleState();
	const calendarRef = useRef<FullCalendar>(null);
	const [create] = useCreate();
	const [update] = useUpdate();
	const [_delete] = useDelete();
	const notify = useNotify();
	const [calendarValue, setCalendarValue] = useState(new Date());
	const [recurrAction, setRecurrAction] = useState("0")
	const [dialog, setDialog] = useState<any>({
		open: false,
		record: undefined
	});
	const [editDialog, setEditDialog] = useState<any>({
		open: false,
		record: undefined
	});
	const [recurrDialog, setRecurrDialog] = useState<any>({
		fcinfo: undefined, //fullcalendar event info
		open: false,
		record: undefined,
		event: undefined //edit or delete
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

	const { data, isLoading, error } = useGetList(
		'employee', { 
            pagination: { page: 0, perPage: 0 }
        }
	);

	const flattenRecord = (event: EventInput) => {
		var record = event,
			extProps = record.extendedProps;

		delete record["extendedProps"];
		var data = { ...record, ...extProps };
		data.dtstart = data.start;
		data.dtend = data.end;

		return data;
	}

	/**
	 * 
	 * @param callback 
	 * @returns 
	 */
	const reloadEvents = (callback?: () => void) => {
		if (!data || !window.start)
			return;

		let groups = data!.map(e => e.id);
		groups = groups.filter(g => !unchecked.includes(g))

		let params = {
			"start": window.start,
			"end": window.end,
			"groups": unchecked.length > 0 ? groups : null,
			"detailed": true
		};

		dataProvider.getTimelineData(params)
			.then((res) => {
				let fetchedEvents = res.data?.map((e: EventInput) => {
					e.start = new Date(e.dtstart);
					e.end = new Date(e.dtend);
					e.allDay = e.all_day;
					e.textColor = textColorOnHEXBg(e.color);
					e.original_start_date = new Date(e.dtstart).toISOString()
					e.title = e.type == "JOB" ? e.title : e.type //TODO: translate this enum
					
					return e;
				})

				setEvents(fetchedEvents);
				if (callback)
					callback()
			})
			.catch(err => {
				console.error(err);
			});
	}

	/**
	 * on window change load the events
	 */
	useEffect(() => {
		reloadEvents()
	}, [window, data, unchecked])

	if (isLoading) { return <Loading />; }
	if (error) { return <p>ERROR</p>; }

	const shallowRemoveEvent = (eventId: string) => {
		let currEvents = events;
		currEvents = currEvents.filter(e => e.id != eventId);

		setEvents(currEvents);
	}

	const eventCreate = (data: any) => {
		data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		data.dtstamp = new Date().toISOString();
		data.dtstart = new Date(data.dtstart).toISOString()
		data.dtend = new Date(data.dtend).toISOString()

		create('event', { data }, {
			onError: (error) => {
				notify(translate("ess.calendar.event.error_create")) 
				console.error(error)
			},
			onSettled: (data, error) => {
				handleClose();
				reloadEvents(() => {
					notify(translate("ess.calendar.event.success_create")) 
				})
			},
		});
	}

	const eventEditSubmit = (info?: EventChangeArg) => {
		let record = info && info.event ? flattenRecord(info.event.toJSON()) : info || editDialog.record;
		record.dtstart = new Date(record.dtstart).toISOString()
		record.dtend = new Date(record.dtend).toISOString()
		//record.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		//record.dtstamp = new Date().toISOString();

		if (record?.parent) {
			setRecurrDialog({
				open: true,
				record: record,
				fcinfo: info,
				event: "edit"
			})
		} else {
			update('event', { id: record.id, data: record }, {
				onError: (error) => {
					notify(translate("ess.calendar.event.error_update")) 
					console.error(error)
				},
				onSettled: (data, error) => {
					notify(translate("ess.calendar.event.success_update")) 
					setEditDialog({
						open: false,
						record: null
					});

					reloadEvents(() => {
						notify(translate("ess.calendar.event.success_create")) 
					})
				}
			})
		}
	}

	const eventRemove = () => {
		const record = editDialog.record || popover.record;
		
		if (record?.parent) {
			setRecurrDialog({
				open: true,
				record: record,
				fcinfo: undefined,
				event: "delete"
			})
		} else {
			_delete('event', { id: record.id, previousData: record }, {
				onError: (error) => {
					notify(translate("ess.calendar.event.error_delete"))
					console.error(error)
				},
				onSettled: (data, error) => {
					notify(translate("ess.calendar.event.success_delete"))
					setPopover({
						open: false,
						record: null,
						anchorEl: null
					});
					shallowRemoveEvent(record.id)
				},
			});
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

	const handleCloseRecurrEvt = () => {
		if (recurrDialog.fcinfo)
			recurrDialog.fcinfo.revert()

		setRecurrDialog({
			open: false,
			fcinfo: undefined,
			record: undefined,
			event: undefined
		})
	}

	const handleSubmitRecurrEvt = () => {
		var data = recurrDialog.record,
			action = recurrAction,
			parent = data.parent,
			event = recurrDialog.event;

		const callback = () => {
			reloadEvents(() => {
				notify(translate("ess.calendar.event.success_update"))

				setRecurrAction("0")
				setPopover({
					open: false,
					record: null,
					anchorEl: null
				});
				setEditDialog({
					open: false,
					record: null
				});
				setRecurrDialog({
					open: false,
					fcinfo: undefined,
					record: undefined,
					event: undefined
				})
			})
		}

		switch (action) {
			case "0": //this event only
				delete data["id"];

				var ex_dates = parent.ex_dates;
				parent.ex_dates = [ex_dates, data.original_start_date].filter(Boolean).join(",");

				delete data["original_start_date"]
				data.recurring = false;

				update('event', { id: parent.id, data: parent }, {
					onError: (error) => {
						notify(translate("ess.calendar.event.error"))
						console.error(error)
					},
					onSettled: (d, error) => {
						if (event == "edit") {
							create('event', { data: data }, {
								onError: (error) => {
									notify(translate("ess.calendar.event.error"))
									console.error(error)
								},
								onSettled: (d, error) => {
									callback()
								}
							});
						} else {
							callback()
						}
					},
				});


				break;
			case "1": //this and following events
				delete data["id"];

				parent.until_type = 1;
				parent.until_date = data.original_start_date;

				delete data["parent"]
				delete data["original_start_date"]

				update('event', { id: parent.id, data: parent }, {
					onError: (error) => {
						notify(translate("ess.calendar.event.error"))
						console.error(error)
					},
					onSettled: (oldevt, error) => {
						if (event == "edit") {
							create('event', { data: data }, {
								onError: (error) => {
									notify(translate("ess.calendar.event.error"))
									console.error(error)
								},
								onSettled: (data, error) => {
									callback()
								},
							});
						} else {
							callback()
						}
					},
				});
				break;
			case "2": //all events
				data.id = parent.id;

				delete data["parent"]
				delete data["original_start_date"]

				_delete('event', { id: data.id, previousData: parent }, {
					onError: (error) => {
						notify(translate("ess.calendar.event.error"))
						console.error(error)
					},
					onSettled: (data, error) => {
						callback()
					},
				});
				break;
			default:
			//unhandled action			
		}
	}

	return (
		<div id="calendar-container" style={{
			margin: "30px 0"
		}}>
			<Box display="flex">
				{
					/**
					 * Left component
					 */
				}
				<Box
					sx={{
						display: { xs: 'none', md: 'block' },
						order: -1,
						width: '17em',
						mr: 2,
						alignSelf: 'flex-start',
						height: "85vh",
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
							{
								/**
								 * Small calendar component
								 */
							}
							<Calendar
								showFixedNumberOfWeeks={true}
								//onChange={setCalendarValue} 
								value={calendarValue}
								formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'narrow' })}
								locale={locale}
								navigationLabel={({ date, label, locale, view }) => label}
								next2Label={null}
								prev2Label={null}
								onClickDay={(value) => {
									let calendar = calendarRef.current;
									calendar?.getApi().gotoDate(value)
									setCalendarValue(value)
								}}
							/>
							{
								/**
								 * Employee list
								 */
							}
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
													<ListItemIcon style={{minWidth: '40px'}}>
														<Checkbox
															edge="start"
															checked={unchecked.indexOf(record.id) === -1}
															tabIndex={-1}
															disableRipple
															style={{
																color: record.color,
															}}
															inputProps={{ 'aria-labelledby': labelId }}
														/>
													</ListItemIcon>
													<ListItemText
														id={labelId}
														primary={record.fullname}
														secondaryTypographyProps={{
															fontWeight: 200,
															fontSize: "12px"
														}}
														secondary={translate("ess.calendar.calendarlist.number") + ": " + record.number} />
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
				{
					/**
					 * Fullcalendar/Main component
					 */
				}
				<Box width={isSmall ? 'auto' : 'calc(100% - 18em)'} height="85vh">
					<FullCalendar
						ref={calendarRef}
						//timeZone={'UTC'}
						locale={locale}
						height="100%"
						selectable={true}
						slotMinTime="05:00:00"
						slotMaxTime="22:00:00"
						plugins={[timeGrid, dayGrid, interactionPlugin]}
						headerToolbar={{
							left: 'today title',
							center: '',
							right: 'prev,next'
						}}
						titleFormat={{ year: 'numeric', month: 'long' }}
						eventMaxStack={5}
						initialView="timeGridWeek"
						select={(info) => {
							setDialog({
								open: true,
								record: {
									dtstart: info.startStr,
									dtend: info.endStr,
									all_day: info.allDay || false
								}
							})
						}}
						eventContent={(eventContent: EventContentArg) => {
							if (eventContent.timeText)
								return (
									<>
										{eventContent.event.title}<br />
										<i>{eventContent.timeText} </i>
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
								record: flattenRecord(item)
							})
						}}
						eventChange={(info) => {
							eventEditSubmit(info)
						}}
						editable={true}
						events={events}
						datesSet={(dateInfo) => {
							setWindow({
								start: dateInfo.start.toISOString(),
								end: dateInfo.end.toISOString()
							})

							if (dateInfo.start > calendarValue || dateInfo.end < calendarValue)
								setCalendarValue(moment(dateInfo.start).add(moment(calendarValue).weekday(), 'd').toDate());

						}}
					/>
				</Box>
			</Box>
			{
				/**
				 * Dialog (popup) opened on "add button"
				 * or on "select" calendar event
				 */
			}
			<Dialog
				open={dialog.open}
				onClose={handleClose}
			>
				<DialogTitle>New event</DialogTitle>
				<DialogContent>
					<EventPopup
						{...dialog}
						sanitizeEmptyValues
						resource="event"
						onSubmit={eventCreate}>
					</EventPopup>
				</DialogContent>
			</Dialog>
			{
				/**
				 * Dialog (popup) opened on "recurring event" change
				 * useful to choose what to do on the recurring timeline
				 */
			}
			<Dialog open={recurrDialog.open}>
				<DialogTitle>Edit recurring event</DialogTitle>
				<DialogContent>
					<FormControl>
						<RadioGroup
							aria-labelledby="demo-radio-buttons-group-label"
							defaultValue="0"
							name="radio-buttons-group"
							onChange={e => {
								setRecurrAction(e.target.value)
							}}
						>
							<FormControlLabel value="0" control={<Radio />} label={translate("ess.calendar.event.recurring.thisev")} />
							<FormControlLabel value="1" control={<Radio />} label={translate("ess.calendar.event.recurring.thisandfoll")} />
							{
								//disabled because it is tricky to handle
								//<FormControlLabel value="2" control={<Radio />} label="All events" />
							}
						</RadioGroup>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseRecurrEvt}>Cancel</Button>
					<Button onClick={handleSubmitRecurrEvt}>OK</Button>
				</DialogActions>
			</Dialog>
			{
				/**
				 * Add button
				 */
			}
			<Fab color="primary" aria-label="add" style={{
				right: 20,
				position: 'fixed',
				bottom: 10
			}} onClick={handleOpen}>
				<AddIcon />
			</Fab>
			{
				/**
				 * Popover attached to the event on event click
				 */
			}
			<Dialog
				open={editDialog.open}
				onClose={() => {
					setEditDialog({
						open: false,
						record: null,
						anchorEl: null
					});
				}}>
				<DialogTitle>Edit event</DialogTitle>
				<DialogContent>
					<EventPopup
						sanitizeEmptyValues
						record={editDialog.record}
						resource="event"
						onSubmit={eventEditSubmit}
						onRemoveClick={eventRemove}>
					</EventPopup>
				</DialogContent>
			</Dialog>

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
				PaperProps={{
					style: { width: '300px' },
				}}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: 'right',
				}}
			>
				<Box sx={{ m: 0.5 }}>
					<Grid container justifyContent="flex-end">
						<IconButton onClick={() => {
							setEditDialog({
								open: true,
								record: popover.record
							});
							setPopover({
								open: false,
								record: null,
								anchorEl: null
							});
						}}>
							<EditIcon />
						</IconButton>
						<IconButton onClick={eventRemove}>
							<DeleteIcon />
						</IconButton>
						<IconButton onClick={() => {
							setPopover({
								open: false,
								record: null,
								anchorEl: null
							});
						}}>
							<CloseIcon />
						</IconButton>
					</Grid>
					<Grid container justifyContent="flex-start">
						<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
							<ListItem>
								<ListItemIcon style={{minWidth: '40px'}}>
									<SquareRoundedIcon style={{ color: popover.record?.backgroundColor }} />
								</ListItemIcon>
								<ListItemText primary={popover.record?.employee_fullname} />
							</ListItem>
							<ListItem>
								<ListItemIcon style={{minWidth: '40px'}}>
									<EventRoundedIcon />
								</ListItemIcon>
								<ListItemText primary={popover.record?.title} />
							</ListItem>
							<ListItem>
								<ListItemIcon style={{minWidth: '40px'}}>
									<QueryBuilderRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={new Date(popover.record?.dtstart).toLocaleString()}
									secondary={new Date(popover.record?.dtend).toLocaleString()} />
							</ListItem>
							<ListItem style={{
								display: popover.record?._rrule == null ? "none" : "default"
							}}>
								<ListItemIcon style={{minWidth: '40px'}}>
									<RepeatRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={popover.record?._rrule?.toText()} />
							</ListItem>
						</List>
					</Grid>
				</Box>
			</Popover>
		</div >
	)
}
