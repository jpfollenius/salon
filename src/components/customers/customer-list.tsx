import * as React from 'react'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { Card, Toolbar, Button, Buttons, Icon } from '../shared/ui'
import commonStyles from '../../styles'
import { CustomerStore, Customer, Gender } from '../../domain/customer-store'
import { ViewState } from '../../domain/view-state'
import CreateCustomerDialog from './create-customer-dialog'
import CustomerDetails from './customer-details'

const styles = {
  layout: {
    display: 'flex',
  },
  searchBox: {
    maxWidth: '400px',
  },
  customerDetails: {
    width: '450px',
    flexShrink: 0,
    marginLeft: '20px',
    transition: 'all 300ms linear',
  },
  rowAction: {
    color: '#98a6ad',
    width: '28px',
    verticalAlign: 'middle',
  }
}

interface CustomerListProps {
  customerStore?: CustomerStore
  viewState?: ViewState
}

@inject('customerStore', 'viewState') @observer
export default class CustomerList extends React.Component<CustomerListProps, {}> {
  @observable selectedCustomer: Customer = undefined
  @observable searchText: string = ''
  
  @computed get tableViewModels() {
    return this.props.customerStore.search(this.searchText).map(customer => {
      return {
        id: customer.id,        
        gender: customer.gender,
        lastName: customer.lastName,
        firstName: customer.firstName,
        phoneNumber: customer.phoneNumber,        
        comment: customer.comment,
        customer: customer
      }
    })
  }

  getGenderIcon(cell, viewModel) {    
    switch (viewModel.gender) {
      case Gender.Male:
        return <Icon style={{color: 'cornflowerblue', fontSize: '22px'}} fontawesome icon="male" />
      case Gender.Female:
        return <Icon style={{color: 'darkmagenta', fontSize: '22px'}} fontawesome icon="female" />
      case Gender.Child:
        return <Icon style={{color: 'orange', fontSize: '22px'}} fontawesome icon="child" />
      default:
        return <div />
    }    
  }

  getRowActions(cell, viewModel) {
    return (
      <span>
        <Icon style={styles.rowAction} icon="pencil" onClick={this.handleEditCustomerClick}/>
        <Icon style={styles.rowAction} icon="remove" onClick={() => this.handleDeleteCustomerClick(viewModel.customer)}/>
      </span>
    )
  }

  handleEditCustomerClick = (e) => {
    console.log('edit')
  }

  handleDeleteCustomerClick = (customer) => {
    console.log('delete')
  }

  @action handleRowSelect = (viewModel, isSelected, e) => {
    if (!isSelected)
      return false 
    
    this.selectedCustomer = viewModel.customer    
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

  @action handleCustomerDelete = () => {
    this.selectedCustomer = undefined
  }

  @action handleSearchTextChange = (e) => {    
    this.searchText = e.target.value
  }

  render() {
    const tableOptions = {
      noDataText: 'Noch keine Kunden vorhanden',      
    }

    const selectionOptions = {
      mode: 'radio',
      hideSelectColumn: true,
      clickToSelect: true,
      bgColor: '#f4f8fb',
      onSelect: this.handleRowSelect,
    }

    const store = this.props.customerStore
    
    return (
      <div style={{...commonStyles.contentContainer, ...styles.layout}}>
        <Card>
          <Toolbar style={commonStyles.cardToolbar}>
            <FormControl style={styles.searchBox} type='text' placeholder='Kunde suchen...' value={this.searchText} onChange={this.handleSearchTextChange} />          
            <Button primary onClick={this.handleNewCustomerClick}><Icon icon="plus" /> Neuer Kunde</Button>
          </Toolbar>

          <BootstrapTable 
            data={this.tableViewModels} 
            options={tableOptions}                  
            selectRow={selectionOptions}
            condensed       
            hover
            bordered={false}            
          >
            <TableHeaderColumn dataField='id' isKey hidden></TableHeaderColumn>
            <TableHeaderColumn dataFormat={this.getGenderIcon} width={30}></TableHeaderColumn>
            <TableHeaderColumn dataField='lastName'>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='firstName'>Vorname</TableHeaderColumn>            
            <TableHeaderColumn dataField='phoneNumber'>Telefonnummer</TableHeaderColumn>            
            <TableHeaderColumn dataField='comment'>Bemerkungen</TableHeaderColumn>            
            <TableHeaderColumn dataField=''>Letzter Termin</TableHeaderColumn>            
            <TableHeaderColumn dataField=''>Nächster Termin</TableHeaderColumn>         
            <TableHeaderColumn dataFormat={this.getRowActions} width={56}></TableHeaderColumn>                                
          </BootstrapTable>             
        </Card>

        { this.selectedCustomer &&  
          <CustomerDetails 
            customer={this.selectedCustomer} 
            onCustomerDelete={this.handleCustomerDelete}
            style={styles.customerDetails}
          />          
        }
      </div>
    )
  }
}