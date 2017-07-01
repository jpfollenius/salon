import * as React from 'react'
import { observable, action, autorun } from 'mobx'
import { inject, observer } from 'mobx-react'
import * as BigCalendar from 'react-big-calendar'
import * as moment from 'moment'

import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as DropdownButton from 'react-bootstrap/lib/DropdownButton'
import * as MenuItem from 'react-bootstrap/lib/MenuItem'

import DayCalendar from './day-calendar'
import WeekCalendar from './week-calendar'
import { Card, Toolbar, Buttons, Button, Icon, DatePicker } from '../shared/ui'
import { Appointment, Appointments, AppointmentStore } from '../../domain/appointment-store'
import commonStyles from '../../styles'

const styles = {
    modeButtons: {        
        marginRight: '10px',
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
    
    render() {       
        return (         
            <Card style={commonStyles.contentContainer}>                 
                <Toolbar style={commonStyles.cardToolbar}>                    
                    <Buttons>
                        <ButtonGroup style={styles.modeButtons}>
                            <Button active={ this.calendarMode === CalendarMode.Day } onClick={ this.handleDayClick }>Tag</Button>
                            <Button active={ this.calendarMode === CalendarMode.Week } onClick= { this.handleWeekClick }>Woche</Button>                               
                        </ButtonGroup>

                        { this.calendarMode === CalendarMode.Day &&                                                
                            <DatePicker                                                                    
                                selectedDate={moment(this.currentDate).toDate()}
                                onChange={this.dateChanged}                                
                            />                            
                        }                      
                    </Buttons>                
                    <Buttons>
                        <Button primary><Icon icon="plus" /> Neuer Termin</Button>
                    </Buttons>                
                </Toolbar>

                { this.getCalendarContent() }                
            </Card>

        )
    }

    getCalendarContent() {
        const store = this.props.appointmentStore

        switch (this.calendarMode) {
            case CalendarMode.Day:
                return <DayCalendar 
                            date={this.currentDate}                             
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