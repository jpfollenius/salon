import * as React from 'react'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import { CustomerStore, Customer } from '../../domain/customer-store'
import { Card } from '../shared/ui'
import CustomerStats from './customer-stats'
import CustomerTable from './customer-table'
import CustomerDetails from './customer-details'

const styles = {
  container: {
    overflowX: 'hidden',
  },
  layout: {
    margin: 20,
    display: 'flex',
    width: 'calc(125vw + 0px)',
    height: 'calc(100vh - 90px)',    
  },  
  layoutCustomerSelected: {
    transform: 'translate(-25vw) translate(-20px)',
    transition: 'transform 300ms ease-in-out',
  },
  layoutNoCustomerSelected: {
    transform: 'translate(0)',
    transition: 'transform 300ms ease-in-out',
  },
  customerStats: {
    width: '25vw',    
  },
  customerList: {
    padding: '0 20px',
    width: 'calc(75vw - 20px)',    
  },
  customerDetails: {        
    width: '25vw',
  },
}

interface CustomersProps {
  customerStore?: CustomerStore
}

@inject('customerStore') @observer
export default class Customers extends React.Component<CustomersProps, {}> {
  @observable selectedCustomer: Customer = undefined

  @action handleCustomerClick = (customer) => {
    this.selectedCustomer = (customer === this.selectedCustomer) ? undefined : customer
  }

  @action handleCustomerDelete = () => {
    // TODO: delete
    this.selectedCustomer = undefined
  }

  @action handleDetailsClose = () => {
    this.selectedCustomer = undefined
  }
  
  render() {
    let layoutStyle = {...styles.layout, ...(this.selectedCustomer ? styles.layoutCustomerSelected : styles.layoutNoCustomerSelected)}    

    return (
      <div style={styles.container}>
        <div style={layoutStyle}>
          <div style={styles.customerStats}>
            <CustomerStats />
          </div>
          <div style={styles.customerList}>
            <CustomerTable
              selectedCustomer={this.selectedCustomer}
              onCustomerClick={this.handleCustomerClick}
            />
          </div>
          <div style={styles.customerDetails}>
            { this.selectedCustomer &&  
              <CustomerDetails 
                customer={this.selectedCustomer} 
                onClose={this.handleDetailsClose}
                onCustomerDelete={this.handleCustomerDelete}                
              />          
            }
          </div>
        </div>
      </div>
    )
  }
}