import * as React from 'react'
import { autorun, observable } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as BigCalendar from 'react-big-calendar'

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
    appointments: Appointments
    onNewAppointment
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
                    events={this.filterAppointmentsByEmployee()} 
                    date={this.props.date}
                    step={15}
                    view='day'                            
                    selectable 
                    formats={calendarFormats} 
                    messages={calendarMessages}
                    toolbar={false} 
                    startAccessor='start' 
                    endAccessor='end' 
                    onSelectSlot={this.slotSelected}
                    min={new Date(2017, 6, 18, 8, 0, 0)}
                    max={new Date(2017, 6, 18, 19, 0, 0)}
                />
            </div>
        )
    }

    filterAppointmentsByEmployee() {
        return this.props.appointments.filterByEmployee(this.props.employee)
    }

    slotSelected = (slotInfo) => {
        this.props.onNewAppointment(slotInfo.start, slotInfo.end, this.props.employee)
    }
}

interface DayCalendarProps {
    date: Date
    onNewAppointment
    appointmentStore?: AppointmentStore
}

@inject('appointmentStore') @observer
export default class DayCalendar extends React.Component<DayCalendarProps, {}> {
    @observable appointments: Appointments

    componentWillMount() {
        this.appointments = this.props.appointmentStore.createAppointments()

        autorun(() => {
            this.appointments.setDateRange(this.props.date, this.props.date)
        })
    }

    componentWillUnmount() {
        this.appointments.release()
    }

    render() {
        const employees = ['Seb', 'Cora', 'Anna']

        return (
            <div style={styles.layout}>
                { employees.map((employee, idx) => 
                    <DayCalendarColumn 
                        key={idx}
                        appointments={this.appointments}
                        date={this.props.date}                        
                        showTime={idx === 0}
                        employee={employee}
                        onNewAppointment={this.handleNewAppointment}
                    />
                )}
                           
            </div>
        )
    }

    handleNewAppointment = (start, end, employee) => {
        this.props.onNewAppointment(start, end,  employee)
    }
}