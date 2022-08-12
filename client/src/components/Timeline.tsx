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
import { Tooltip } from '@mui/material';
import ReactDOM from 'react-dom/client';
import BadgeIcon from '@mui/icons-material/Badge';

const divStyle = {
	width: "100%",
	height: "100%",
};

//TODO: check first render item/groups timing

const Timeline1 = () => {
	const ref = useRef(null);
	const notify = useNotify();
	const [create] = useCreate();
	const [update] = useUpdate();
	const [open, setOpen] = useState(false);
	const [rendered, setRendered] = useState(false);
	const [props, setProps] = useState({
		record: undefined
	});
	const timeline = useRef<any | null>(null);
	const items = useRef<DataSet<TimelineItem>>(new DataSet<TimelineItem>());
	const groups = useRef<DataSet<TimelineGroup>>(new DataSet<TimelineGroup>());

	useEffect(() => {
		timeline.current = new VisTimeline(ref.current!, items.current, groups.current, {
			stack: true,
			stackSubgroups: false,
			zoomKey: 'ctrlKey',
			zoomMin: 3600000 * 24,
			height: '100%',
			groupHeightMode: 'fixed',
			margin: {
				item: 5,
				axis: 5
			},
			groupTemplate: function (item,element,data) {
				const txt = item.nome + " " + item.cognome;
				const root = item.root ? item.root : ReactDOM.createRoot(
					element as HTMLElement
				);
				root.render(
					<Tooltip title={txt} followCursor>
						<div>
							<BadgeIcon /> {txt}
						</div>
					</Tooltip>
				);

				item.root = root;

				return '<div>.</div>';
			},
			template: function (item, element, data) {
				let tooltip = item.start.toLocaleString("it-IT") + " - " + item.end.toLocaleString("it-IT"); //TODO: make locale dynamic
				console.log(tooltip, item)
				const root = item.root ? item.root : ReactDOM.createRoot(
					element as HTMLElement
				);
				root.render(
					<Tooltip title={tooltip} followCursor>
						<div>
							{item.cliente_id}
						</div>
					</Tooltip>
				);

				item.root = root;

				return '<div>.</div>';
			},
			verticalScroll: true,
			orientation: "top", // necessario affinchè la scrollbar verticale parta dall'alto
			editable: {
				add: false,
				remove: true,
				updateTime: true,
				updateGroup: true
			},
			locale: 'it_IT', //TODO: make locale dynamic
			selectable: true,
			multiselect: false,
			onRemove: function (item, callback) { },
			onUpdate: function (item, callback) {
				handleOpen(item);
				callback(item);
			},
			xss: {
				disabled: true,
			},
			onInitialDrawComplete: function () {
				loadGroups(() => {setTimeout(loadItems, 50)});
			},

			onMove: function (item, callback) { // bound drag or range move
				const recId = item["id"];
				let data = {
					id: recId,
					start_date: item.start,
					end_date: item.end,
					dipendente_id: item.group
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
		if (!props.record) {
			create('agenda', { data }, {
				onError: (error) => {
					notify("Error on creation") //TODO: make locale dynamic
					console.error(error)
				},
				onSettled: (data, error) => {
					handleClose();
					loadItems();
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
					loadItems();
					notify("Item updated") //TODO: make locale dynamic
				},
			})
		}
	}

	const debounce = (func: any, wait: number | undefined, immediate: any, extraArgs: any) => {
		var timeout: any;

		return () => {
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
						r.content = r.nome + " " + r.cognome;
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

	const loadItems = () => {
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
						r.group = r.dipendente_id;
						return r
					});
					let newRecords = records.filter((r: any) => {
						return !items.current.get(r.id)
					})
					newRecords = newRecords.map((r: any) => {
						return r;
					})
					items.current.add(newRecords);
				})
			.catch((e) => {
			})
			.finally(() => {
			});
	}

	const handleClose = () => {
		setOpen(false)
		setProps({
			record: undefined
		})
	}

	const handleOpen = (record: any = null) => {
		debugger;
		if (record && record.id) {
			setProps({
				record: record
			})
		}

		setOpen(true)
	}

	return (
		<div style={divStyle}>
			<div ref={ref} style={divStyle} />
			<Dialog
				open={open}
				onClose={handleClose}
			>
				<Box>
					<SimpleForm
						//{...(props.record != null ? { record: props.record } : {})}
						resource="agenda"
						onSubmit={postSave}>
						<DateTimeInput source="start_date" label="Data inizio" />
						<DateTimeInput source="end_date" label="Data fine" />
						<ReferenceInput source="dipendente_id" reference="dipendente" label="Dipendente">
							<SelectInput optionText="nome" />
						</ReferenceInput>
						<ReferenceInput source="cliente_id" reference="cliente" label="Cliente">
							<SelectInput optionText="descrizione" />
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
	);
}

export default Timeline1;
