import * as React from "react";
import { EventChangeArg, EventContentArg, EventInput } from '@fullcalendar/core';
import dayGrid from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGrid from '@fullcalendar/timegrid'; // a plugin!
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Card, CardContent, Checkbox, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, IconButton, Popover, Radio, RadioGroup, Stack, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useRef, useState } from 'react';
import { Loading, useCreate, useDelete, useGetList, useLocaleState, useNotify, useTheme, useTranslate, useUpdate } from 'react-admin';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { EventPopup } from '../components/EventPopup';
import { dataProvider } from '../dataProvider';
import { textColorOnHEXBg } from '../utils/Utilities';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import QueryBuilderRoundedIcon from '@mui/icons-material/QueryBuilderRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import { getDateInCurrentUsersTimezone } from '../utils/DateUtils';


export default function CalendarView() {
	const [timezone, setTimezone] = useState<{
		name: string;
		description: string;
	} | undefined>(undefined);

	const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
	const translate = useTranslate();
	const [locale] = useLocaleState();
	const calendarRef = useRef<FullCalendar>(null);
	const [create] = useCreate();
	const [update] = useUpdate();
	const [_delete] = useDelete();
	const notify = useNotify();
	const [calendarValue, setCalendarValue] = useState<Date>(new Date());
	const [activeStartDate, setActiveStartDate] = useState<Date>(new Date()); // Stato per la navigazione del calendario

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
	});

	const flattenRecord = (event: EventInput | undefined) => {
		var record = event,
			extProps = record?.extendedProps;

		if (!record)
			return;

		delete record["extendedProps"];
		var data = { ...record, ...extProps };
		data.dtstart = data.start;
		data.dtend = data.end;

		return data;
	}

	const translateEventTitle = (event: any) => {
		if (event.title?.match("SICKNESS|PERMIT|MAKEUP|HOLIDAY")) {
			return <i><b>{translate("ess.calendar.event.type." + event.title?.toLowerCase())}</b></i>
		} else {
			return event.title;
		}
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
			"detailed": true,
			"timezone": timezone?.name
		};

		dataProvider.getTimelineData(params)
			.then((res) => {
				let fetchedEvents = res.data?.map((e: EventInput) => {
					e.start = e.dtstart;
					e.end = e.dtend;
					e.allDay = e.all_day;
					e.textColor = textColorOnHEXBg(e.color);
					e.original_start_date = new Date(e.dtstart).toISOString() //useful for handling exdates in recurring events
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

	useEffect(() => {
		dataProvider.getUserPreferences()
			.then((res) => {
				setTimezone({
					name: res.timezone,
					description: res.timezone_description
				});
			})
	}, []);

	/**
	 * on window change load the events
	 */
	useEffect(() => {
		if (!timezone)
			return;

		reloadEvents()
	}, [window, data, unchecked, timezone])

	if (isLoading || !timezone) { return <Loading />; }
	if (error) { return <p>ERROR</p>; }

	const shallowRemoveEvent = (eventId: string) => {
		let currEvents = events;
		currEvents = currEvents.filter(e => e.id != eventId);

		setEvents(currEvents);
	}

	const eventCreate = (data: any) => {
		data.dtend_tz = data.dtend_tz || timezone?.name;
		data.dtstart_tz = data.dtstart_tz || timezone?.name;

		data.dtstamp = new Date().toISOString();
		data.dtstart = getDateInCurrentUsersTimezone(data.dtstart, data.dtstart_tz).toISOString();
		data.dtend = getDateInCurrentUsersTimezone(data.dtend, data.dtend_tz).toISOString();

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

	/**
	 * Handles the submission of changes made in the event popup dialog.
	 * 
	 * This function updates the `dtstart` and `dtend` properties of the event record
	 * to reflect the current user's timezone, converts them to ISO string format,
	 * and then submits the updated record for editing.
	 * 
	 * @remarks
	 * - If no record is present in the `editDialog`, the function exits early.
	 * - The `getDateInCurrentUsersTimezone` function is used to adjust the date-time values.
	 * 
	 * @returns {void} This function does not return a value.
	 */
	const eventPopupChangeSubmit = (info?: EventChangeArg) => {
		let record = info && info.event ? flattenRecord(info.event.toJSON()) : info || editDialog.record;

		if (!record)
			return;

		record.dtstart_tz = record.dtstart_tz || timezone?.name;
		record.dtend_tz = record.dtend_tz || timezone?.name;

		record.dtstart = getDateInCurrentUsersTimezone(record.dtstart, record.dtstart_tz).toISOString();
		record.dtend = getDateInCurrentUsersTimezone(record.dtend, record.dtend_tz).toISOString();

		eventEdit(record, info);
	}

	/**
	 * Handles the editing of an event in the calendar.
	 * 
	 * If the event has a parent, it opens a dialog to handle recurring events.
	 * Otherwise, it updates the event directly and handles success or error notifications.
	 * 
	 * @param record - The event record to be edited. Contains event details.
	 * @param info - (Optional) Additional information about the event change.
	 * 
	 * - If `record.parent` is truthy:
	 *   - Opens a dialog (`setRecurrDialog`) to manage recurring events.
	 * 
	 * - If `record.parent` is falsy:
	 *   - Calls the `update` function to update the event.
	 *   - On error:
	 *     - Logs the error to the console.
	 *     - Displays an error notification using `notify`.
	 *   - On success:
	 *     - Displays a success notification using `notify`.
	 *     - Closes the edit dialog (`setEditDialog`).
	 *     - Reloads the events and displays a creation success notification.
	 */
	const eventEdit = (record: any, info?: EventChangeArg) => {
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
					setEditDialog({
						open: false,
						record: null
					});

					reloadEvents(() => {
						notify(translate("ess.calendar.event.success_update"))
					})
				}
			})
		}
	}
	/**
	 * Handles the removal of an event from the calendar.
	 * 
	 * If the event has a parent (indicating it is part of a recurring series),
	 * it opens a dialog to confirm the deletion of the recurring event.
	 * Otherwise, it directly deletes the event by calling the `_delete` function.
	 * 
	 * The `_delete` function handles the deletion process and provides feedback
	 * to the user via notifications. It also updates the UI by closing the popover
	 * and removing the event from the calendar view.
	 * 
	 * @remarks
	 * - If the event has a parent, the `setRecurrDialog` function is called to
	 *   handle recurring event deletion.
	 * - If the event does not have a parent, the `_delete` function is invoked
	 *   with appropriate callbacks for error handling and UI updates.
	 * 
	 * @throws
	 * - Logs an error to the console if the deletion fails.
	 * 
	 * @example
	 * // Example usage:
	 * eventRemove();
	 */
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
								value={calendarValue} 
								activeStartDate={activeStartDate} 
								formatShortWeekday={(locale, date) =>
									date.toLocaleDateString(locale, { weekday: 'narrow' })
								}
								locale={locale}
								navigationLabel={({ date, label, locale, view }) => label}
								next2Label={null}
								prev2Label={null}
								onActiveStartDateChange={({ activeStartDate }) => {
									if (activeStartDate)
										setActiveStartDate(activeStartDate); 
								}}
								onClickDay={(value) => {
									let calendar = calendarRef.current;
									calendar?.getApi().gotoDate(value);
									setCalendarValue(value); 
									setActiveStartDate(value)
								}}
							/>
							{
								/**
								 * Employee list
								 */
							}
							<Divider sx={{ margin: "20px 0" }} />
							<Box
								display="flex"
								justifyContent="space-between"
								alignItems="center"
								padding="0 6px"
								marginTop="20px"
								marginBottom="10px"
							>
								{/* Titolo con icona */}
								<Stack direction="row" alignItems="center" spacing={1}>
									<CalendarMonthIcon color="primary" />
									<Typography
										variant="h6"
										component="h4"
										sx={{
											margin: 0,
											fontSize: "1rem",
											fontWeight: "bold",
											color: "primary.main",
										}}
									>
										{translate("ess.calendar.calendars")}
									</Typography>
								</Stack>

								{/* Pulsanti Seleziona/Deseleziona */}
								<Stack direction="row" spacing={1}>
									<Tooltip title={translate("ess.calendar.calendarlist.select_all")}>
										<IconButton
											size="small"
											color="primary"
											onClick={() => setUnchecked([])} // Seleziona tutti
										>
											<CheckBoxIcon fontSize="small" />
										</IconButton>
									</Tooltip>
									<Tooltip title={translate("ess.calendar.calendarlist.deselect_all")}>
										<IconButton
											size="small"
											color="primary"
											onClick={() => setUnchecked(data!.map((record) => record.id))} // Deseleziona tutti
										>
											<CheckBoxOutlineBlankIcon fontSize="small" />
										</IconButton>
									</Tooltip>
								</Stack>
							</Box>
							<nav aria-label="main">
								<List>
									{data!.map(record => {
										const labelId = `checkbox-list-label-${record.id}`;
										return (
											<ListItem disablePadding key={record.id}>
												<ListItemButton role={undefined} onClick={handleToggle(record.id)} dense>
													<ListItemIcon style={{ minWidth: '40px' }}>
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
						timeZone={timezone?.name}
						locale={locale}
						height="100%"
						selectable={true}
						customButtons={{
							timezone: {
								text: timezone?.description,
							}
						}}
						slotMinTime="05:00:00"
						slotMaxTime="22:00:00"
						plugins={[timeGrid, dayGrid, interactionPlugin]}
						headerToolbar={{
							left: 'today title',
							center: '',
							right: 'timezone prev,next'
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
										{translateEventTitle(eventContent.event._def)}<br />
										<i>{eventContent.timeText} </i>
									</>
								)

							return (
								<>
									<i>{translateEventTitle(eventContent.event._def)}</i>
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
							eventPopupChangeSubmit(info)
						}}
						editable={true}
						events={events}
						datesSet={(dateInfo) => {
							setWindow({
								start: dateInfo.start.toISOString(),
								end: dateInfo.end.toISOString()
							})

							if (dateInfo.start > calendarValue || dateInfo.end < calendarValue) {
								setCalendarValue(new Date(dateInfo.start.getTime() + (calendarValue.getDay() * 24 * 60 * 60 * 1000)));
								setActiveStartDate(new Date(dateInfo.start.getTime() + (calendarValue.getDay() * 24 * 60 * 60 * 1000)));
							}

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
				<DialogTitle>{translate("ess.calendar.dialog.new_event_title")}</DialogTitle>
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
				<DialogTitle>{translate("ess.calendar.dialog.edit_recurring_event_title")}</DialogTitle>
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
					<Button onClick={handleCloseRecurrEvt}>{translate("ra.action.cancel")}</Button>
					<Button onClick={handleSubmitRecurrEvt}>{translate("ra.action.confirm")}</Button>
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
				<DialogTitle>{translate("ess.calendar.dialog.edit_event_title")}</DialogTitle>
				<DialogContent>
					<EventPopup
						sanitizeEmptyValues
						record={editDialog.record}
						resource="event"
						onSubmit={eventPopupChangeSubmit}
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
								<ListItemIcon style={{ minWidth: '40px' }}>
									<SquareRoundedIcon style={{ color: popover.record?.backgroundColor }} />
								</ListItemIcon>
								<ListItemText primary={popover.record?.employee_fullname} />
							</ListItem>
							<ListItem>
								<ListItemIcon style={{ minWidth: '40px' }}>
									<EventRoundedIcon />
								</ListItemIcon>
								<ListItemText primary={popover.record?.title} />
							</ListItem>
							<ListItem>
								<ListItemIcon style={{ minWidth: '40px' }}>
									<QueryBuilderRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={new Date(popover.record?.dtstart).toLocaleString()}
									secondary={new Date(popover.record?.dtend).toLocaleString()} />
							</ListItem>
							<ListItem style={{
								display: popover.record?._rrule == null ? "none" : "default"
							}}>
								<ListItemIcon style={{ minWidth: '40px' }}>
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
