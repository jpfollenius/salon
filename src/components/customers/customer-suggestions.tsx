import * as React from 'react'
import { inject, observer } from 'mobx-react'

import GenderIcon from './gender-icon'
import CustomerIcon from './customer-icon'
import { Customer, CustomerStore, Gender } from '../../domain/customer-store'
import { Icon } from '../shared/ui'

const styles = {
  customerRow: {
    borderBottom: '1px solid lightgray',
    minHeight: 64,   
    display: 'flex',
    alignItems: 'center',
    margin: 10,
    paddingLeft: 10,
    cursor: 'pointer',    
  },
  rowIcon: {
    marginRight: 20,
  }
}

interface CustomerSuggestionsProps {
  customerStore?: CustomerStore
  onCustomerSelect?: (customer) => void
}

function CustomerAppointmentSuggestionRow({ customer, appointmentTime, appointmentServices, onSelect }) {
  return (
    <div style={styles.customerRow} onClick={() => onSelect(customer)}>
      <div style={styles.rowIcon}>
        <CustomerIcon customer={customer} />
      </div>
      <div>
        <div><big>{customer.fullName}</big></div>
        <small><Icon icon='clock-o' fontawesome /> {appointmentTime} {appointmentServices}</small>        
      </div>
      
    </div>
  )
}

function RunningCustomerRow({ customer, onSelect }) {
  return (
    <div style={styles.customerRow} onClick={() => onSelect(customer)}>
      <div style={styles.rowIcon}>
        <GenderIcon color='#333' gender={customer.gender} />
      </div>
      <big>{customer.fullName}</big>      
    </div>
  )
}

@inject('customerStore') @observer
export default class CustomerSuggestions extends React.Component<CustomerSuggestionsProps, {}> {
  render() {
    const store = this.props.customerStore

    const exampleCustomer = new Customer(this.props.customerStore)
    exampleCustomer.firstName = 'Max'
    exampleCustomer.lastName = 'Mustermann'
    exampleCustomer.gender = Gender.Male

    return (
      <div>
        <CustomerAppointmentSuggestionRow
          customer={exampleCustomer}
          appointmentTime='15:30'
          appointmentServices='Haare schneiden, Föhnen'
          onSelect={this.props.onCustomerSelect}
        />
        <CustomerAppointmentSuggestionRow
          customer={exampleCustomer}
          appointmentTime='15:30'
          appointmentServices='Haare schneiden, Föhnen'
          onSelect={this.props.onCustomerSelect}
        />
        
        <RunningCustomerRow
          customer={store.maleRunningCustomer}
          onSelect={this.props.onCustomerSelect}
        />
        <RunningCustomerRow
          customer={store.femaleRunningCustomer}
          onSelect={this.props.onCustomerSelect}
        />
        <RunningCustomerRow
          customer={store.childRunningCustomer}
          onSelect={this.props.onCustomerSelect}
        />



      </div>

    )
  }

}