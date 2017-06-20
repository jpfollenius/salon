import * as React from 'react'
import {observer} from 'mobx-react'
import * as BigCalendar from 'react-big-calendar'

const calendarFormats = {
    dateFormat: 'L',

    dayFormat: (date, culture, localizer) => {            
        return localizer.format(date, 'dd, l', culture)
    },

    dayRangeHeaderFormat: ({ start, end }, culture, local) =>
        local.format(start, { date: 'short' }, culture) + ' — ' +
        local.format(end, { date: 'short' }, culture)
}

const calendarMessages = {
    allDay: '',
    previous: 'Vorheriger',
    next: 'Nächster',
    today: 'Heute',
    month: 'Monat',
    week: 'Woche',
    day: 'Tag',
    agenda: 'Liste',
    showMore: function() {}
}

interface WeekCalendarProps {

}

@observer
export default class WeekCalendar extends React.Component<WeekCalendarProps, {}> {
    render() {
        return (
            <div>
                <BigCalendar 
                    events={[]} 
                    view='week'                            
                    selectable 
                    formats={calendarFormats} 
                    messages={calendarMessages}
                    toolbar={false} 
                    startAccessor='start' 
                    endAccessor='end' 
                    min={new Date(2017, 6, 18, 8, 0, 0)}
                    max={new Date(2017, 6, 18, 19, 0, 0)}
                />         
            </div>
        )
    }
}