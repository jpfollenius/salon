import * as React from 'react'
import ReactDatePicker from 'react-datepicker'
import * as moment from 'moment'
import * as Button from 'react-bootstrap/lib/Button'
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import * as DropdownButton from 'react-bootstrap/lib/DropdownButton'
import * as MenuItem from 'react-bootstrap/lib/MenuItem'

import Icon from './icon'

import './date-picker.css'

const styles = {
  layout: {
    display: 'flex',
  },
  leftRounded: {
    borderRadius: '4px 0 0 4px',
  },
  rightRounded: {
    borderRadius: '0 4px 4px 0',
  },
  notRounded: {
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: '0'
  }
}

interface DatePickerProps {
  style?
  selectedDate: Date
  onChange: (Date) => void
  dayIncrement?: number
}

export default class DatePicker extends React.Component<DatePickerProps, {}> {    
  handleTodayClick = () => {
    this.props.onChange(moment().startOf('day').toDate())
  }

  handlePreviousClick = () => {
    this.props.onChange(moment(this.props.selectedDate).subtract(this.props.dayIncrement || 1, 'day').toDate())
  }

  handleNextClick = () => {
    this.props.onChange(moment(this.props.selectedDate).add(this.props.dayIncrement || 1, 'day').toDate())
  }

  handleWeekOffsetSelected = (weeks) => {
    this.props.onChange(moment(this.props.selectedDate).add(1, 'week').toDate())
  }

  render() {
    console.log(this.props.style)
    return (      
      <div style={{...styles.layout, ...this.props.style}}>
        <Button style={styles.leftRounded} onClick={this.handleTodayClick} ><Icon fontawesome icon="calendar" /></Button>
        <Button style={styles.notRounded} onClick={this.handlePreviousClick} ><Icon icon="chevron-left" /></Button>
        <ReactDatePicker
          className='date-picker'          
          dateFormat='dd, l'
          selected={moment(this.props.selectedDate)}
          onChange={this.props.onChange}
        />
        <Button style={styles.notRounded} onClick={this.handleNextClick} ><Icon icon="chevron-right" /></Button>
        <DropdownButton pullRight style={styles.rightRounded} title={<Icon icon='plus' />} noCaret onSelect={this.handleWeekOffsetSelected}>
          <MenuItem eventKey={1}>+ 1 Woche</MenuItem>
          <MenuItem eventKey={2}>+ 2 Wochen</MenuItem>
          <MenuItem eventKey={3}>+ 3 Wochen</MenuItem>
          <MenuItem eventKey={4}>+ 4 Wochen</MenuItem>
          <MenuItem eventKey={5}>+ 5 Wochen</MenuItem>
          <MenuItem eventKey={6}>+ 6 Wochen</MenuItem>
          <MenuItem eventKey={7}>+ 7 Wochen</MenuItem>
          <MenuItem eventKey={8}>+ 8 Wochen</MenuItem>
        </DropdownButton>                                 
      </div>
    )
  }
}