import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import timeGrid from '@fullcalendar/timegrid' // a plugin!
import { Box, Chip, useMediaQuery, Theme, Card, CardContent } from '@mui/material';

const divStyle = {
	width: "100%",
	height: "100%",
};

export default function CalendarView() {
	const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
	
    return (
		<div id="calendar-container" style={{
			margin: "30px 0"
		}}>
			<Box display="flex">
				<Card
					sx={{
						display: { xs: 'none', md: 'block' },
						order: -1,
						width: '15em',
						mr: 2,
						alignSelf: 'flex-start',
					}}
				>
					<CardContent sx={{ pt: 1 }}>

					</CardContent>
				</Card>
				<Box width={isSmall ? 'auto' : 'calc(100% - 16em)'} height="85vh">
				<FullCalendar
					locale="it"
					height="100%"
					slotMinTime="05:00:00"
					slotMaxTime="22:00:00"
					plugins={[ timeGrid ]}
					initialView="timeGridWeek"
				/>
				</Box>
			</Box>
		</div>
    )
}