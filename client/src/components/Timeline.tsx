import React, { Component, useEffect, useState } from 'react';
import { DataSet } from 'vis-data';
import { Timeline as VisTimeline } from 'vis-timeline/standalone';
import type {
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


export class Timeline extends Component<{}> {
	public timeline!: any;
	public readonly items: DataSet<TimelineItem>;
	public readonly groups: DataSet<TimelineGroup>;

	state = {
		open: false,
		record: undefined
	}

	#ref = React.createRef<HTMLDivElement>();

	constructor(props: {} | Readonly<{}>) {
		super(props);

		this.items = new DataSet<TimelineItem>();
		this.groups = new DataSet<TimelineGroup>();
	}

	componentWillUnmount() {
		this.timeline.destroy();
	}

	componentDidMount() {
		var me = this;
		this.timeline = new VisTimeline(this.#ref.current!, this.items, this.groups, {
			stack: true,
			stackSubgroups: false,
			zoomKey: 'ctrlKey',
			zoomMin: 3600000 * 24,
			height: '100%',
			groupHeightMode: 'fixed',
			margin: {
				item: 5,
				axis: 0
			},
			/*groupTemplate: function(item) {
				return `${item.cognome} ${item.nome}`
			},
			template: function(item) {
				return `${item.cognome} ${item.nome}`
			},*/
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
			onRemove: function (item, callback) { },
			onUpdate: function (item, callback) {
				me.handleOpen(item);
			},
			onAdd: function (item, callback) {
				me.handleOpen(item);
			},
			xss: {
				disabled: true,
			},
			onInitialDrawComplete: function () {
				me.loadGroups(() => setTimeout(() => me.loadItems(), 200))
			},

			onMove: function (item, callback) { // bound drag or range move
			}
		});

		this.timeline.on("scrollSide", this.debounce(this.loadItems, 200, false, null))
		this.timeline.on("rangechange", this.debounce(this.loadItems, 200, false, null))
	}

	debounce = (func: any, wait: number | undefined, immediate: any, extraArgs: any) => {
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

	loadGroups = (callback: () => void) => {
		let me = this;

		fetch(process.env.REACT_APP_SERVER_BASEURL + "/api/dipendente", {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
			.then(
				(result) => {
					me.timeline.setGroups(result.map((r: any) => {
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

	loadItems = () => {
		let me = this;
		let start = new Date(me.timeline.range.start).toISOString();
		let end = new Date(me.timeline.range.end).toISOString();
		let vGroups = me.timeline.getVisibleGroups();

		vGroups = vGroups.map((g: any) => {
			return Number(g);
		})
		let params = {
			"start": start,
			"end": end,
			"groups": vGroups
		};

		fetch(process.env.REACT_APP_SERVER_BASEURL + "/api/timeline-agenda?" + new URLSearchParams(params), {
			method: "GET",
			credentials: 'include',

		}).then(res => res.json())
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
						return !me.timeline.itemsData.get(r.id)
					})
					newRecords = newRecords.map((r: any) => {
						return r;
					})
					me.timeline.itemsData.add(newRecords);
					debugger;
				})
			.catch((e) => {
			})
			.finally(() => {
			});
	}

	handleOpen = (record: any) => {
		this.setState({
			open: true,
			record: record
		})
	}

	handleClose = () => {
		this.setState({
			open: false,
			record: undefined
		})
	}
	render() {
		return (
			<div style={divStyle}>
				<div ref={this.#ref} style={divStyle} />
				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
				>
					<Box>
						<SimpleForm record={this.state.record} resource="agenda">
							<TextInput source="descrizione" validate={[required()]} fullWidth label="Descrizione" />
							<TextInput source="indirizzo" validate={[required()]} label="Indirizzo" />
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
		)
	}
}