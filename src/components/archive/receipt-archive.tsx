import * as React from 'react'
import { observable, action, autorun } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { formatPrice } from '../../utils/utils'
import { ReceiptStore, Receipts, Receipt } from '../../domain/receipt-store'
import { Toolbar, Buttons, Button, Icon, DatePicker, Spinner } from '../shared/ui'


//--- ExpandedReceiptArchiveRow ---


function ExpandedReceiptArchiveRow({ receipt }) {
  const styles = {
    table: {
      margin: '20px',
    },
    comment: {
      margin: '20px 0',
    }
  }

  return (       
    <div style={styles.table}>
      <BootstrapTable         
        data={receipt.items} 
      >
        <TableHeaderColumn dataField='name' isKey></TableHeaderColumn>
        <TableHeaderColumn dataField='quantity'>Menge</TableHeaderColumn>
        <TableHeaderColumn dataField='totalPrice' dataAlign="right" dataFormat={(cell, item) => <span>{formatPrice(item.totalPrice)} €</span>}>Preis</TableHeaderColumn>          
      </BootstrapTable>  
      
      <p style={styles.comment}>Bemerkung: -</p>

      <Buttons>
        <Button danger>Storno</Button>
        <Button>Bondruck</Button>
      </Buttons>

    </div>
  )
}


//--- ReceiptArchive ---


const styles = {
  toolbar: {
    marginBottom: '20px',
    borderBottom: 'none',    
  }
}

interface ReceiptArchiveProps {
  receiptStore?: ReceiptStore
  navigation
}

@inject('receiptStore') @observer
export default class ReceiptArchive extends React.Component<ReceiptArchiveProps, {}> { 
  @observable date: Date = moment().toDate()  
  @observable selectedReceipt: Receipt = undefined
  receipts: Receipts
  cleanupAutorun

  componentWillMount() {
    this.receipts = this.props.receiptStore.createReceipts()

    this.cleanupAutorun = autorun(() => {      
      this.receipts.setDateRange(this.date, this.date)
    })
  }

  componentWillUnmount() {
    this.receipts.release()
    this.cleanupAutorun()
  }

  @action handleDateChange = (date) => {
    this.date = date
  }

  @action handlePreviousDayClick = () => {
    this.date = moment(this.date).subtract(1, 'day').toDate()
  }

  @action handleNextDayClick = () => {
    this.date = moment(this.date).add(1, 'day').toDate()
  }

  @action handleReceiptClick = (receipt) => {
    if (this.selectedReceipt === receipt) {
      this.selectedReceipt = undefined
    } else {
      this.selectedReceipt = receipt
    }
  }  

  getExpandComponent(receipt) {    
    return <ExpandedReceiptArchiveRow receipt={receipt} />
  }

  getPrice(cell, receipt) {
    return <span>{formatPrice(receipt.totalPrice)} €</span>
  }

  getTime(cell, receipt) {
    return <span>{moment(receipt.date).format('HH:mm')}</span>
  }

  render() {        
    const tableOptions = {
      noDataText: 'Keine Belege vorhanden',
      expandRowBgColor: '#eee'
    }

    return (
      <div>
        <Toolbar style={styles.toolbar}>
          {this.props.navigation}          
          <DatePicker
            selectedDate={this.date}
            onChange={this.handleDateChange}
          />          
        </Toolbar>  

        { !this.receipts.isLoading &&
          <BootstrapTable 
            data={this.receipts.getAll()} 
            options={tableOptions}                         
            hover
            bordered={false}
            expandableRow={(row) => true}
            expandComponent={this.getExpandComponent}            
          >
            <TableHeaderColumn dataField='number' isKey>Belegnummer</TableHeaderColumn>
            <TableHeaderColumn dataField='date' dataFormat={this.getTime}>Zeit</TableHeaderColumn>
            <TableHeaderColumn dataField=''>Kunde</TableHeaderColumn>
            <TableHeaderColumn dataField=''>Mitarbeiter</TableHeaderColumn>            
            <TableHeaderColumn dataField='' width={200}>Bemerkung</TableHeaderColumn>            
            <TableHeaderColumn dataField='' dataAlign="right">Bar</TableHeaderColumn>
            <TableHeaderColumn dataField='' dataAlign="right">EC</TableHeaderColumn>            
            <TableHeaderColumn dataField='totalPrice' width={200} dataAlign="right" dataFormat={this.getPrice}>Belegsumme</TableHeaderColumn>          
          </BootstrapTable>                                              
        }
      </div>            
      )
  }
}