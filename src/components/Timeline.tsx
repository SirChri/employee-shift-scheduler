import React, { useEffect, useState }  from 'react';
import { DataSet } from 'vis-data';
import { Timeline as VisTimelineCtor } from 'vis-timeline';
import type {
	Timeline as VisTimeline,
	TimelineGroup,
	TimelineItem
} from 'vis-timeline/types';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { SimpleForm, TextInput, required, ReferenceInput, SelectInput, DateTimeInput, useGetList } from 'react-admin';

const divStyle = {
    width: "100%",
    height: "100%",
  };

export const Timeline = () => {
	var timeline!: Readonly<VisTimeline>;
	var items: DataSet<TimelineItem> = new DataSet<TimelineItem>();
	var groups: DataSet<TimelineGroup> = new DataSet<TimelineGroup>();

	const [state, setState] = useState({
		open: false,
		record: undefined
	});
	const ref = React.createRef<HTMLDivElement>();
	
	useEffect(() => {
		timeline = new VisTimelineCtor(ref.current!, items, groups, {
			stack: true,
			stackSubgroups: false,
			zoomKey: 'ctrlKey',
			zoomMin: 3600000*24,
			height: '100%',
			groupHeightMode: 'fixed',
			margin: {
				item: 5,
				axis: 0
			},
			verticalScroll: true,
			orientation: "top", // necessario affinchè la scrollbar verticale parta dall'alto
			editable: {
				add: false,
				remove: true,
				updateTime: true,
				updateGroup: true
			},
			locale: 'it_IT',
			selectable: true,
			multiselect: false,
			onRemove: function(item, callback) {},
			onUpdate: function(item, callback) {
				handleOpen(item);
			},
			onAdd: function(item, callback) {
				handleOpen(item);
			},
			xss: {
				disabled: true,
			},
			onInitialDrawComplete: function() {
	
			},
	
			onMove: function(item, callback) { // bound drag or range move
			}
		});
	}, [timeline]);

	useGetList(
		'agenda',
		{},
		{
			onSuccess: (data) => {
				items.add(data.data.map((r) => {
					r.start = new Date(r.start_date);
					r.end = new Date(r.end_date)
					return r;
				}));
			},
			onError: (error) => {
				debugger;
			},
		}
	);

	const handleOpen = (record: any) => {
		setState({
			open: true,
			record: record
		})
	}
	const handleClose = () => {
		setState({
			open: false,
			record: undefined
		})
	}

	return (
		<div style={divStyle}>
		<div ref={ref} style={divStyle} />
		<Dialog 
				open={state.open}
				onClose={handleClose}
			>
			<Box>
				<SimpleForm record={state.record} resource="agenda">
					<TextInput source="descrizione" validate={[required()]} fullWidth label="Descrizione" />
					<TextInput source="indirizzo" validate={[required()]}  label="Indirizzo" />
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

		</div>
	);
}