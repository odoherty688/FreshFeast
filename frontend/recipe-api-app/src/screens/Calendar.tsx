import React, { useState } from 'react';
import { momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import DnDCalendar from '../components/DragAndDropCalendar';
import { AlertColor } from '@mui/material';
import AlertPopup from '../components/Alert';


const localizer = momentLocalizer(moment)
const CalendarScreen = () => {
    const [alertMessage, setAlertMessage] = useState<string>("");
    const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    return (
        <div data-testid='screen'>
            <DnDCalendar localizer={localizer} alertOpen={alertOpen} setAlertMessage={setAlertMessage} setAlertSeverity={setAlertSeverity} setAlertOpen={setAlertOpen}/>
            <AlertPopup severity={alertSeverity} message={alertMessage} open={alertOpen} setOpen={setAlertOpen}/>
        </ div>
    )
}

export default CalendarScreen;