import React, { Component, useEffect, useRef, useState } from 'react';
import { DataSet } from 'vis-data';
import { Timeline as VisTimeline } from 'vis-timeline';
import type {
	TimelineGroup,
	TimelineItem
} from 'vis-timeline/types';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import { SimpleForm, TextInput, required, ReferenceInput, SelectInput, DateTimeInput, useGetList, useCreate } from 'react-admin';
import Fab from '@mui/material/Fab';

const divStyle = {
	width: "100%",
	height: "100%",
};

const Timeline1 = () => {
    const ref = useRef(null);
    const [create] = useCreate();
    const [open, setOpen] = useState(false);
    const [props, setProps] = useState({
        record: undefined
    });
    const timeline = useRef<any|null>(null);

    useEffect(() => {
        timeline.current = new VisTimeline(ref.current!, [], [], {
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
				handleOpen(item);
			},
			xss: {
				disabled: true,
			},
			onInitialDrawComplete: function () {
                //debugger;
				loadGroups(() => setTimeout(() => loadItems(), 200))
			},

			onMove: function (item, callback) { // bound drag or range move
			}
		});

		timeline.current.on("scrollSide", debounce(loadItems, 200, false, null))
		timeline.current.on("rangechange", debounce(loadItems, 200, false, null))
      }, []);

    const postSave = (data: any) => {
        create('agenda', { data }, {
            onError: (error) => {
                // error is an instance of Error.
            },
            onSettled: (data, error) => {
                handleClose();
                loadItems();
            },
        });
        
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
		fetch(process.env.REACT_APP_SERVER_BASEURL + "/api/dipendente", {
			method: "GET",
			credentials: 'include',
		}).then(res => res.json())
			.then(
				(result) => {
					timeline.current.setGroups(result.map((r: any) => {
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
						return !timeline.current.itemsData.get(r.id)
					})
					newRecords = newRecords.map((r: any) => {
						return r;
					})
					timeline.current.itemsData.add(newRecords);
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
                    {...(props.record != null ? {record: props.record} : {})}
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