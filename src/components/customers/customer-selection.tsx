import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { CustomerStore } from '../../domain/customer-store'
import CustomerIcon from './customer-icon'

const styles = {
  customerRow: {
    borderBottom: '1px solid lightgray',
    minHeight: 64,   
    display: 'flex',
    alignItems: 'center',
    margin: 10,
    paddingLeft: 10,
  },
  customerIcon: {
    marginRight: 20,
  }
}

function CustomerRow({ customer, onSelect }) {
  return (
    <div style={styles.customerRow} onClick={() => onSelect(customer)}>
      <div style={styles.customerIcon}>
        <CustomerIcon customer={customer} />
      </div>
      <h4>{customer.fullName}</h4>
    </div>
  )
}

interface CustomerSelectionProps {
  searchText: string
  customerStore?: CustomerStore
  onCustomerSelect?: (customer) => void
}

@inject('customerStore') @observer
export default class CustomerSelection extends React.Component<CustomerSelectionProps, {}> {
  render() {
    const store = this.props.customerStore

    return (
      <div>
        {store.search(this.props.searchText).map(customer => (
          <CustomerRow
            key={customer.id}
            customer={customer}
            onSelect={this.props.onCustomerSelect}
          />
        ))}
      </div>
    )
  }
}