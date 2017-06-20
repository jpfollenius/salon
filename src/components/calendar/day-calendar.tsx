import * as React from 'react'
import { observer } from 'mobx-react'
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

interface DayCalendarProps {
    date: Date
}

const styles = {
    layout: {
        display: 'flex'
    },
    calendarCol: {
        flexGrow: 1
    },
    colHeader: {
        textAlign: 'center',
        padding: '10px 0',
    }

}

interface DayCalendarColumnProps {
    employee: string
    showTime: boolean
    date: Date

}

@observer
class DayCalendarColumn extends React.Component<DayCalendarColumnProps, {}> {    
    render() {
        const className = this.props.showTime ? 'day-calendar' : 'day-calendar calendar-notime'

        return (
            <div style={styles.calendarCol} className={className}>
                <div style={styles.colHeader}>
                    { this.props.employee }
                </div>
                <BigCalendar                         
                    events={[]} 
                    date={this.props.date}
                    view='day'                            
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

@observer
export default class DayCalendar extends React.Component<DayCalendarProps, {}> {
    render() {
        const employees = ['Seb', 'Cora', 'Anna']

        return (
            <div style={styles.layout}>
                { employees.map((employee, idx) => 
                    <DayCalendarColumn 
                        key={idx}
                        date={this.props.date}
                        showTime={idx === 0}
                        employee={employee}
                    />
                )}
                           
            </div>
        )
    }
}