import React, { Component, useEffect, useRef, useState } from 'react';
import { DataSet } from 'vis-data';
import { Timeline as VisTimeline } from 'vis-timeline/standalone';
import type {
	TimelineGroup,
	TimelineItem
} from 'vis-timeline/types';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { SimpleForm, TextInput, required, ReferenceInput, SelectInput, DateTimeInput, useNotify, useCreate, useUpdate } from 'react-admin';
import Fab from '@mui/material/Fab';
import { dataProvider } from '../dataProvider'
import { Tooltip, Typography } from '@mui/material';
import ReactDOM from 'react-dom/client';
import BadgeIcon from '@mui/icons-material/Badge';

const divStyle = {
	width: "100%",
	height: "100%",
};

export default function TimelineView() {

    const ref = useRef(null);
	const notify = useNotify();
	const [create] = useCreate();
	const [update] = useUpdate();
	const [open, setOpen] = useState(false);
	const [rendered, setRendered] = useState(false);
	const [props, setProps] = useState<any>({
		record: undefined
	});
	const timeline = useRef<any | null>(null);
	const items = useRef<DataSet<TimelineItem>>(new DataSet<TimelineItem>());
	const groups = useRef<DataSet<TimelineGroup>>(new DataSet<TimelineGroup>());

	useEffect(() => {
		timeline.current = new VisTimeline(ref.current!, items.current, groups.current, {
			stack: false,
			stackSubgroups: false,
			zoomKey: 'ctrlKey',
			zoomMin: 60 * 60 * 24 * 1000,
			zoomMax: 60 * 60 * 24 * 30 * 1000,
			height: '100%',
			groupHeightMode: 'fixed',
			margin: {
				item: 5,
				axis: 10
			},
			groupTemplate: function (item, element, data) {
				const txt = item.name + " " + item.surname;
				const root = item.root ? item.root : ReactDOM.createRoot(
					element as HTMLElement
				);
				root.render(
					<Tooltip title={txt} followCursor>
						<div style={{ width: "100%" }}>
							<BadgeIcon /> {txt} <br />
							<em>{"Dipendente"}</em>
						</div>
					</Tooltip>
				);

				item.root = root;

				return '<div>.</div>';
			},
			template: function (item, element, data) {
				let tooltip = item.start.toLocaleString("it-IT") + " - " + item.end.toLocaleString("it-IT"); //TODO: make locale dynamic

				let title = (
					<React.Fragment>
						<Typography color="inherit">{item.customer_descr} {"(" + item.hours + " hours)"}</Typography>
						<em>{tooltip}</em>
					</React.Fragment>
				)

				const root = item.root ? item.root : ReactDOM.createRoot(
					element as HTMLElement
				);
				root.render(
					<Tooltip title={title} followCursor>
						<div style={{ height: 40 }}>
							{item.customer_descr}<br />
							{item.hours + " hours"}
						</div>
					</Tooltip>
				);

				item.root = root;

				return `<div style="height: 40px">.</div>`;
			},
			verticalScroll: true,
			orientation: "top", // necessario affinchè la scrollbar verticale parta dall'alto
			editable: {
				add: false,
				remove: true,
				updateTime: true,
				updateGroup: true
			},
			hiddenDates: [{
				start: '2017-03-04 00:00:00',
				end: '2017-03-06 00:00:00',
				repeat: 'weekly'
			},
			// hide outside of 9am to 5pm - use any 2 days and repeat daily
			{
				start: '2017-03-04 19:00:00',
				end: '2017-03-05 07:00:00',
				repeat: 'daily'
			}
			],
			locale: 'it_IT', //TODO: make locale dynamic
			selectable: true,
			multiselect: false,
			onRemove: function (item, callback) { },
			onUpdate: function (item, callback) {
				debugger;
				handleOpen(item);
			},
			xss: {
				disabled: true,
			},
			onInitialDrawComplete: function () {
				loadGroups(() => { setTimeout(loadItems, 50) });
			},

			onMove: function (item, callback) { // bound drag or range move
				const recId = item["id"];
				let data = {
					id: recId,
					start_date: item.start,
					end_date: item.end,
					employee_id: item.group
				}

				update('agenda', { id: recId, data: data }, {
					onError: (error) => {
						notify("Error on updating") //TODO: make locale dynamic
						console.error(error)
						callback(null);
					},
					onSettled: (data, error) => {
						notify("Item updated") //TODO: make locale dynamic
						callback(item);
					}
				})
			}
		});

		timeline.current.on("scrollSide", debounce(loadItems, 200, false, null))
		timeline.current.on("rangechange", debounce(loadItems, 200, false, null))
	}, [timeline, groups, items]);

	const postSave = (data: any) => {
		if (!props || !props.record) {
			create('agenda', { data }, {
				onError: (error) => {
					notify("Error on creation") //TODO: make locale dynamic
					console.error(error)
				},
				onSettled: (data, error) => {
					handleClose();
					loadItems(undefined);
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
					items.current.remove(recId)
					handleClose();
					loadItems(undefined);
					notify("Item updated") //TODO: make locale dynamic
				},
			})
		}
	}

	const debounce = (func: any, wait: number | undefined, immediate: any, extraArgs: any) => {
		var timeout: any;

		return function(this: any) {
			var context = this,
				args = extraArgs;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	const loadGroups = (callback: () => void) => {
		dataProvider.getTimelineGroups()
			.then(
				(result) => {
					groups.current.clear();
					groups.current.add(result.map((r: any) => {
						r.content = r.name + " " + r.surname;
						return r;
					}))
				})
			.catch((e) => {
			})
			.finally(() => {
				if (callback)
					callback()
			});
	};

	const loadItems = (callback: (() => void) | undefined) => {
		if (!timeline.current) return;

		let start = new Date(timeline.current.range.start).toISOString();
		let end = new Date(timeline.current.range.end).toISOString();
		let vGroups = timeline.current.getVisibleGroups();

		vGroups = vGroups.map((g: any) => {
			return Number(g);
		})
		let params = {
			"start": start,
			"end": end,
			"groups": vGroups
		};

		dataProvider.getTimelineData(params)
			.then(
				(result) => {
					let records = result || [];
					records = records.map((r: any) => {
						r.start = new Date(r.start_date);
						r.end = new Date(r.end_date);
						r.group = r.employee_id;
						return r
					});
					let newRecords = records.filter((r: any) => {
						return !items.current.get(r.id)
					})
					newRecords = newRecords.map((r: any) => {
						r.className = "color" + Number(r.group) % 3;

						return r;
					})
					items.current.add(newRecords);

					if (callback)
						callback()
				})
			.catch((e) => {
			})
			.finally(() => {
			});
	}

	const handleClose = () => {
		if (props && props.record) {
			loadItems(() => setOpen(false));
		} else {
			setOpen(false)
		}
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
		<div style={{
			margin: "30px 0",
			flex: "1 1 auto"
		}}>
			<div style={divStyle}>
				<div ref={ref} style={divStyle} />
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
			</div>
		</div>
	);
}
