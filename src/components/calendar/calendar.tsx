import * as React from 'react'
import { observable, action, autorun } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as BigCalendar from 'react-big-calendar'
import * as moment from 'moment'
import DatePicker from 'react-datepicker'

import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as DropdownButton from 'react-bootstrap/lib/DropdownButton'
import * as MenuItem from 'react-bootstrap/lib/MenuItem'

import DayCalendar from './day-calendar'
import WeekCalendar from './week-calendar'
import { Toolbar, Buttons, Button, Icon } from '../shared/ui'
import { Appointment, Appointments, AppointmentStore } from '../../domain/appointment-store'

const styles = {
    datepicker: {
        height: '36px',
        marginLeft: '10px',
    }
}

enum CalendarMode {
    Day,
    Week,
}

interface CalendarProps {
    appointmentStore?: AppointmentStore
}

@inject('appointmentStore') @observer
export default class Calendar extends React.Component<CalendarProps, {}> {
    @observable calendarMode = CalendarMode.Day
    @observable currentDate = moment().toDate()
    @observable appointments: Appointments

    componentWillMount() {
        autorun(() => {
            this.reloadAppointments(this.currentDate, this.currentDate)            
        })
    }

    @action reloadAppointments(from, to) {
        if (this.appointments) {
            console.log('RELEASE')
            this.appointments.release()
        }

        this.appointments = this.props.appointmentStore.getAppointments(this.currentDate, this.currentDate)
    }
    
    render() {       
        return (         
            <div>                 
                <Toolbar>                    
                    <Buttons>
                        <ButtonGroup>
                            <Button active={ this.calendarMode === CalendarMode.Day } onClick={ this.handleDayClick }>Tag</Button>
                            <Button active={ this.calendarMode === CalendarMode.Week } onClick= { this.handleWeekClick }>Woche</Button>                               
                        </ButtonGroup>

                        { this.calendarMode === CalendarMode.Day &&                                                
                            <DatePicker                                    
                                className='date-picker'
                                style={styles.datepicker}
                                dateFormat='dd, l'
                                selected={moment(this.currentDate)}
                                onChange={this.dateChanged}
                            />                            
                        }

                        <ButtonGroup>
                            <Button onClick={ this.gotoToday }>Heute</Button>
                            <Button onClick={ this.goPrevious }><Icon icon='chevron-left' /></Button>                                                                                                       
                            <Button onClick={ this.goNext }><Icon icon='chevron-right' /></Button>                                                    
                            <DropdownButton title={<Icon icon='plus' />} noCaret onSelect={this.weekOffsetSelected}>
                                <MenuItem eventKey={1}>+ 1 Woche</MenuItem>
                                <MenuItem eventKey={2}>+ 2 Wochen</MenuItem>
                                <MenuItem eventKey={3}>+ 3 Wochen</MenuItem>
                                <MenuItem eventKey={4}>+ 4 Wochen</MenuItem>
                                <MenuItem eventKey={5}>+ 5 Wochen</MenuItem>
                                <MenuItem eventKey={6}>+ 6 Wochen</MenuItem>
                                <MenuItem eventKey={7}>+ 7 Wochen</MenuItem>
                                <MenuItem eventKey={8}>+ 8 Wochen</MenuItem>
                            </DropdownButton>                                                                                    
                        </ButtonGroup>
                    </Buttons>                
                    <Buttons>
                        <Button primary>Neuer Termin</Button>
                    </Buttons>                
                </Toolbar>

                { this.getCalendarContent() }                
            </div>

        )
    }

    getCalendarContent() {
        const store = this.props.appointmentStore

        switch (this.calendarMode) {
            case CalendarMode.Day:
                return <DayCalendar 
                            date={this.currentDate} 
                            appointments={this.appointments}
                            onNewAppointment={this.handleNewAppointment}
                        />
            case CalendarMode.Week:
                return <WeekCalendar date={this.currentDate} />  
        }
    }

    @action goPrevious = () => {
        switch (this.calendarMode) {
            case CalendarMode.Day:
                this.currentDate = moment(this.currentDate).subtract(1, 'days').toDate()
                break
            case CalendarMode.Week:
                this.currentDate = moment(this.currentDate).subtract(1, 'week').toDate()
                break
        }        
    }

    @action goNext = () => {
        switch (this.calendarMode) {
            case CalendarMode.Day:
                this.currentDate = moment(this.currentDate).add(1, 'days').toDate()
                break
            case CalendarMode.Week:
                this.currentDate = moment(this.currentDate).add(1, 'week').toDate()
                break
        }
    }

    @action gotoToday = () => {
        this.currentDate = moment().toDate()
    }

    @action dateChanged = (date) => {
        this.currentDate = date
    }

    @action weekOffsetSelected = (eventKey) => {
        this.currentDate = moment(this.currentDate).add(eventKey, 'weeks').toDate()
    } 

    @action handleDayClick = () => {
        this.calendarMode = CalendarMode.Day
    }

    @action handleWeekClick = () => {
        this.calendarMode = CalendarMode.Week
    }

    @action handleNewAppointment = (start, end, employee) => {
        this.props.appointmentStore.addAppointment(new Appointment('Termin', start, end, employee))
    }
}