import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import * as BigCalendar from 'react-big-calendar'
import * as moment from 'moment'
import DatePicker from 'react-datepicker'

import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import * as Button from 'react-bootstrap/lib/Button'
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'
import * as FormControl from 'react-bootstrap/lib/FormControl'

import DayCalendar from './day-calendar'
import WeekCalendar from './week-calendar'

const styles = {
    datepicker: {
        height: '32px',
        marginLeft: '10px',
    }
}

enum CalendarMode {
    Day,
    Week,
}

interface CalendarProps {

}

@observer
export default class Calendar extends React.Component<CalendarProps, {}> {
    @observable calendarMode = CalendarMode.Day
    @observable currentDate = moment().toDate()

    render() {       
        return (         
            <div>                 
                <div className='toolbar'>                    
                    <div>                      
                        <ButtonToolbar>
                            <ButtonGroup>
                                <Button active={ this.calendarMode === CalendarMode.Day } onClick={ this.handleDayClick }>Tag</Button>
                                <Button active={ this.calendarMode === CalendarMode.Week } onClick= { this.handleWeekClick }>Woche</Button>                               
                            </ButtonGroup>

                            { this.calendarMode === CalendarMode.Day &&                                                
                                <DatePicker                                    
                                    className='date-picker'
                                    style={styles.datepicker}
                                    selected={moment()}
                                />                            
                            }

                            <ButtonGroup>
                                <Button><Glyphicon glyph='chevron-left' /></Button>                                                                                                       
                                <Button><Glyphicon glyph='chevron-right' /></Button>                                                    
                                <Button><Glyphicon glyph='plus' /></Button>                                                                                    
                            </ButtonGroup>
                        </ButtonToolbar>
                    </div>
                    <div>
                        <ButtonToolbar>
                            <Button bsStyle='primary'>Neuer Termin</Button>
                        </ButtonToolbar>
                    </div>
                </div>

                { this.getCalendarContent() }                
            </div>

        )
    }

    getCalendarContent() {
        switch (this.calendarMode) {
            case CalendarMode.Day:
                return <DayCalendar date={this.currentDate}/>                                     
            case CalendarMode.Week:
                return <WeekCalendar />  
        }
    }

    @action handleDayClick = () => {
        this.calendarMode = CalendarMode.Day
    }

    @action handleWeekClick = () => {
        this.calendarMode = CalendarMode.Week
    }
}
