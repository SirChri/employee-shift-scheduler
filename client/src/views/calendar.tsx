import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGrid from '@fullcalendar/timegrid' // a plugin!
import dayGrid from '@fullcalendar/daygrid'
import { Box, Chip, useMediaQuery, Theme, Card, CardContent, Checkbox, IconButton, Popover, Button, DialogTitle, DialogContent, DialogActions, FormControl, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import { dataProvider } from '../dataProvider'
import interactionPlugin from '@fullcalendar/interaction';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { useNotify, useCreate, useUpdate, useGetList, Loading, useDelete, useTranslate, useLocaleState } from 'react-admin';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { textColorOnHEXBg, eventTypeEnum } from '../utils/Utilities';
import moment from 'moment';
import { EventPopup } from '../components/EventPopup';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { EventChangeArg, EventContentArg, EventInput } from '@fullcalendar/core';
import rrulePlugin from '@fullcalendar/rrule'
import { RRule, RRuleSet } from 'rrule';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';


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

	const { data, total, isLoading, error } = useGetList(
		'employee'
	);

	const utcDate = (date: Date) => {
		return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
	}

	const flattenRecord = (event: EventInput) => {
		var record = event,
			extProps = record.extendedProps;

		delete record["extendedProps"];
		var data = { ...record, ...extProps };
		data.start_date = data.start;
		data.end_date = data.end;

		return data;
	}

	/**
	 * 
	 * @param e the recurring event 
	 * @returns array of "exploded" events in the current window
	 */
	const recurrentDates = (e: EventInput) => {
		const startDate = new Date(e?.start_date);
		let out: EventInput[] = [];
		let rrule = new RRule({
			freq: e?.frequency,
			interval: e?.interval,
			dtstart: utcDate(startDate),
			until: e?.until == 1 && e?.until_date ? new Date(e?.until_date) : null,
			count: e?.until == 2 ? e?.until_occurrences : null,
			byweekday: e?.byweekday,
		});

		const rruleSet = new RRuleSet();
		rruleSet.rrule(
			rrule
		);

		if (e.ex_dates)
			e.ex_dates?.forEach((d: string) => rruleSet.exdate(utcDate(new Date(d))))

		let i = 0;
		let duration = (new Date(e.end_date).getTime() - new Date(e.start_date).getTime());

		rruleSet.between(new Date(window.start), new Date(window.end))?.map((d) => new Date(
			d.getUTCFullYear(),
			d.getUTCMonth(),
			d.getUTCDate(),
			d.getUTCHours(),
			d.getUTCMinutes(),
		)).forEach((d: Date) => {
			out.push({
				id: e.id + "_" + i++,
				start: new Date(d),
				end: new Date(d.getTime() + duration),
				type: e.type,
				color: e.color,
				allDay: e.all_day,
				textColor: textColorOnHEXBg(e.color),
				title: e.type != "j" ? eventTypeEnum[e.type as keyof typeof eventTypeEnum] : e.customer_descr,
				employee_id: e.employee_id,
				employee_descr: e.employee_descr,
				customer_id: e.customer_id,
				recurring: true,
				frequency: e.frequency,
				interval: e.interval,
				until: e?.until,
				until_date: e?.until_date,
				until_occurrences: e?.until_occurrences,
				byweekday: e?.byweekday,
				_parent: e,
				_original_start_date: new Date(d).toISOString(),
				_rrule: rrule
			})
		})

		return out;
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
			"groups": unchecked.length > 0 ? groups : "all"
		};

		dataProvider.getTimelineData(params)
			.then((fetchedEvents) => {
				fetchedEvents = fetchedEvents?.map((e: EventInput) => {
					e.start = e.start_date;
					e.end = e.end_date;
					e.allDay = e.all_day;
					e.textColor = textColorOnHEXBg(e.color);
					e.title = e.type != "j" ? eventTypeEnum[e.type as keyof typeof eventTypeEnum] : e.customer_descr;

					return e;
				})

				let recurrentEvs: EventInput[] = [];
				fetchedEvents.filter((e: EventInput) => e.recurring)?.forEach((e: any) => {
					recurrentEvs = recurrentEvs.concat(recurrentDates(e));
				})

				setEvents([...fetchedEvents.filter((e: EventInput) => !e.recurring), ...recurrentEvs]);

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

	const shallowAddEvent = (event: EventInput) => {
		setEvents(current => [...current, event]);

		return event;
	}

	const shallowEditEvent = (event: EventInput) => {
		let curEv = events.find(e => e.id == event["id"]);
		setEvents(current => [...current.filter(e => e.id != event["id"]), { ...curEv, ...event }]);
	}

	const shallowRemoveEvent = (eventId: string) => {
		let currEvents = events;
		currEvents = currEvents.filter(e => e.id != eventId);

		setEvents(currEvents);
	}

	const eventCreate = (data: any) => {
		data.customer_id = data.customer_id === "" ? null : data.customer_id;
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
		const record = info && info.event ? flattenRecord(info.event.toJSON()) : info || editDialog.record;

		if (record?._parent) {
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

					shallowEditEvent(record);
				}
			})
		}
	}

	const eventRemove = () => {
		const record = editDialog.record || popover.record;

		if (record?._parent) {
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
					shallowRemoveEvent(record.id)
					setEditDialog({
						open: false,
						record: null
					});
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
			parent = data._parent,
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
				data.parent_id = parent.id;
				delete data["id"];

				var ex_dates = parent.ex_dates || [];
				ex_dates.push(data._original_start_date);
				parent.ex_dates = ex_dates;

				delete data["_parent"]
				delete data["_original_start_date"]
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

				parent.until = 1;
				parent.until_date = data._original_start_date;

				delete data["_parent"]
				delete data["_original_start_date"]

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

				delete data["_parent"]
				delete data["_original_start_date"]

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
								locale={locale}
								onClickDay={(value) => {
									let calendar = calendarRef.current;
									calendar?.getApi().gotoDate(value)
								}}
								activeStartDate={moment(calendarValue).startOf('month').toDate()}
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
													<ListItemIcon>
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
						locale={locale}
						height="100%"
						selectable={true}
						slotMinTime="05:00:00"
						slotMaxTime="22:00:00"
						plugins={[timeGrid, dayGrid, interactionPlugin, rrulePlugin]}
						headerToolbar={{
							left: 'prev,next',
							center: 'title',
							right: 'today'
						}}
						eventMaxStack={5}
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

							setCalendarValue(moment(dateInfo.start).add(moment(new Date()).weekday(), 'd').toDate());
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
								<ListItemIcon>
									<SquareRoundedIcon style={{ color: popover.record?.backgroundColor }} />
								</ListItemIcon>
								<ListItemText primary={popover.record?.title} />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<EventRoundedIcon />
								</ListItemIcon>
								<ListItemText primary={popover.record?.employee_descr} />
							</ListItem>
							<ListItem>
								<ListItemIcon>
									<QueryBuilderRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={new Date(popover.record?.start_date).toLocaleString()}
									secondary={new Date(popover.record?.end_date).toLocaleString()} />
							</ListItem>
							<ListItem style={{
								display: popover.record?._rrule == null ? "none" : "default"
							}}>
								<ListItemIcon>
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
