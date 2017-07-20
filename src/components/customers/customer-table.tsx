import * as React from 'react'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as Table from 'react-bootstrap/lib/Table'
import { Scrollbars } from 'react-custom-scrollbars'

import { Card, Toolbar, Button, Buttons, Icon } from '../shared/ui'
import commonStyles from '../../styles'
import { CustomerStore, Customer, Gender } from '../../domain/customer-store'
import { ViewState } from '../../domain/view-state'
import CreateCustomerDialog from './create-customer-dialog'
import CustomerIcon from './customer-icon'

const styles = {  
  card: {
    height: '100%',    
  },
  tableContainer: {    
    overflowY: 'scroll',
    height: 'calc(100% - 60px)',
  },
  searchBox: {
    maxWidth: '400px',
  },  
  rowAction: {
    color: '#98a6ad',
    width: '28px',
    verticalAlign: 'middle',
  },
  selectedRow: {
    backgroundColor: 'gray',
  }
}

interface CustomerTableProps {
  customerStore?: CustomerStore
  viewState?: ViewState
  onCustomerClick: (Customer) => void
  selectedCustomer: Customer
}

@inject('customerStore', 'viewState') @observer
export default class CustomerTable extends React.Component<CustomerTableProps, {}> {  
  @observable searchText: string = ''
  
  @computed get tableViewModels() {
    return this.props.customerStore.search(this.searchText).map(customer => {
      return {
        id: customer.id,        
        gender: customer.gender,
        lastName: customer.lastName,
        firstName: customer.firstName,                
        customer: customer
      }
    })
  }

  getGenderIcon(customer) { 
    return (
      <div style={{padding: 5}}>
        <CustomerIcon customer={customer} />    
      </div>
    )
  }

  @action handleRowClick = (viewModel, isSelected, e) => {          
    this.props.onCustomerClick(viewModel.customer)
  }

  handleCreateCustomerDialogCancel = () => {
    this.props.viewState.closeModal()
  }

  handleCreateCustomerDialogSubmit = (customer) => {
    this.props.customerStore.addCustomer(customer)
    this.props.viewState.closeModal()    
  }

  handleNewCustomerClick = () => {
    this.props.viewState.showModal('Neuer Kunde',
      <CreateCustomerDialog 
        onCancel={this.handleCreateCustomerDialogCancel}
        onSubmit={this.handleCreateCustomerDialogSubmit}
      />
    )
  }

  @action handleSearchTextChange = (e) => {    
    this.searchText = e.target.value
  }

  render() {
    const store = this.props.customerStore
    
    return (      
      <Card style={styles.card}>
        <Toolbar style={commonStyles.cardToolbar}>
          <FormControl style={styles.searchBox} type='text' placeholder='Kunde suchen...' value={this.searchText} onChange={this.handleSearchTextChange} />          
          <Button primary onClick={this.handleNewCustomerClick}><Icon icon="plus" /> Neuer Kunde</Button>
        </Toolbar>
        
        <Scrollbars autoHide style={{ width: '100%', height: 'calc(100% - 60px)' }}>     
          <Table>
            <thead>
              <tr>
                <th width={75} />
                <th>Name</th>
                <th>Vorname</th>
                <th>Letzter Termin</th>
                <th>Nächster Termin</th>
              </tr>
            </thead>
            <tbody>
              {this.tableViewModels.map(viewModel => {
                const isSelected = (this.props.selectedCustomer === viewModel.customer)
                const rowClass = isSelected ? 'active' : ''

                return (
                  <tr className={rowClass} onClick={() => {this.props.onCustomerClick(viewModel.customer)}}>
                    <td>{this.getGenderIcon(viewModel.customer)}</td>
                    <td>{viewModel.lastName}</td>
                    <td>{viewModel.firstName}</td>
                    <td></td>
                    <td></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>    
        </Scrollbars>          
      </Card>            
    )
  }
}