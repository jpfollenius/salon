import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import * as BigCalendar from 'react-big-calendar'
import * as moment from 'moment'

import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import * as Button from 'react-bootstrap/lib/Button'
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'

interface CalendarProps {

}

@observer
export default class Calendar extends React.Component<CalendarProps, {}> {
    @observable activeView = 'day'

    render() {       
        let formats = {
            dateFormat: 'L',

            dayFormat: (date, culture, localizer) => {            
                return localizer.format(date, 'dd, l', culture)
            },

            dayRangeHeaderFormat: ({ start, end }, culture, local) =>
                local.format(start, { date: 'short' }, culture) + ' — ' +
                local.format(end, { date: 'short' }, culture)
        }

        const messages = {
            allDay: 'Ganzer Tag',
            previous: 'Vorheriger',
            next: 'Nächster',
            today: 'Heute',
            month: 'Monat',
            week: 'Woche',
            day: 'Tag',
            agenda: 'Liste',
            showMore: function() {}
        }

        return (         
            <div> 
                <div className='toolbar'>
                    <div>
                        <ButtonGroup>
                            <Button active={ this.activeView === 'day' } onClick={ this.handleDayClick }>Tag</Button>
                            <Button active={ this.activeView === 'week' } onClick= { this.handleWeekClick }>Woche</Button>                               
                        </ButtonGroup>
                    </div>
                    <div>
                        <ButtonToolbar>
                            <Button bsStyle='primary'>Neuer Termin</Button>
                        </ButtonToolbar>
                    </div>
                </div>

                <BigCalendar 
                    events={[]} 
                    view={ this.activeView }
                    views={['week', 'day']} 
                    selectable 
                    formats={formats} 
                    messages={messages}
                    toolbar={false} 
                    startAccessor='' 
                    endAccessor='' 
                />           
            </div>

        )
    }

    @action handleDayClick = () => {
        this.activeView = 'day'
    }

    @action handleWeekClick = () => {
        this.activeView = 'week'
    }
}
