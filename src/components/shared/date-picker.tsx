import * as React from 'react'
import ReactDatePicker from 'react-datepicker'
import * as moment from 'moment'

import './date-picker.css'

const styles = {
    datepicker: {
        height: '36px',
        marginLeft: '10px',
    }
}

interface DatePickerProps {
  selectedDate: Date
  onChange: (Date) => void
}

export default class DatePicker extends React.Component<DatePickerProps, {}> {
  render() {
    return (
      <ReactDatePicker
        className='date-picker'
        style={styles.datepicker}
        dateFormat='dd, l'
        selected={moment(this.props.selectedDate)}
        onChange={this.props.onChange}
      />
    )
  }
}