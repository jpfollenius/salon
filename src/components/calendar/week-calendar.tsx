import * as React from 'react'
import { observable, autorun } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as BigCalendar from 'react-big-calendar'
import * as moment from 'moment'
import { Appointment, Appointments, AppointmentStore } from '../../domain/appointment-store'

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
    date: Date
    appointmentStore?: AppointmentStore
}

@inject('appointmentStore') @observer
export default class WeekCalendar extends React.Component<WeekCalendarProps, {}> {
    @observable appointments: Appointments
    cleanupAutorun

    componentWillMount() {
        this.appointments = this.props.appointmentStore.createAppointments()

        this.cleanupAutorun = autorun(() => {
            const weekStart = moment(this.props.date).startOf('week').toDate()
            const weekEnd = moment(this.props.date).endOf('week').toDate()
            this.appointments.setDateRange(weekStart, weekEnd)
        })
    }

    componentWillUnmount() {
        this.appointments.release()
        this.cleanupAutorun()
    }

    render() {
        return (
            <div>
                <BigCalendar 
                    events={this.appointments.getAll()} 
                    date={this.props.date}
                    view='week'                            
                    selectable 
                    step={15}
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