// pages/calendar.js
import { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

export default function CalendarPage() {
  const [events, setEvents] = useState([]);

  const handleDateClick = (arg) => {
    const title = prompt('Enter event title:');
    if (title) {
      setEvents([...events, { title, start: arg.dateStr }]);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: 'sans-serif' }}>
      <h1>LiveOps Calendar</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridDay'
        }}
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
}

