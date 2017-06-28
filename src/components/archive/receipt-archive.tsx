import * as React from 'react'
import { observable, action, autorun } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { formatPrice } from '../../utils/utils'
import { ReceiptStore, Receipts, Receipt } from '../../domain/receipt-store'
import { Toolbar, Buttons, Button, Icon, DatePicker, Spinner } from '../shared/ui'

const receiptTableWidth = 600

const styles = {
  colRight: {
    textAlign: 'right',
  },    
}

function ReceiptArchiveRow({ receipt, onClick, isSelected }) {
  return (
    <tr key={receipt.id} onClick={() => onClick(receipt)}>
      <td>{receipt.id}</td>
      <td>{moment(receipt.date).format('HH:mm')}</td>
      <td style={styles.colRight}>{receipt.totalQuantity}</td>
      <td style={styles.colRight}>{formatPrice(receipt.totalPrice)} €</td>
    </tr>
  )
}

function ExpandedReceiptArchiveRow({ receipt }) {
  const styles = {
    table: {
      margin: '20px',
    },
    comment: {
      margin: '20px 0',
    }
  }

  const tableOptions = {

  }

  return (       
    <div style={styles.table}>
      <BootstrapTable         
        data={receipt.items} 
        options={tableOptions}                           
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


interface ReceiptArchiveProps {
  receiptStore?: ReceiptStore
  navigation
}

@inject('receiptStore') @observer
export default class ReceiptArchive extends React.Component<ReceiptArchiveProps, {}> { 
  @observable date: Date = moment().toDate()  
  @observable selectedReceipt: Receipt = undefined
  receipts: Receipts

  componentWillMount() {
    this.receipts = this.props.receiptStore.createReceipts()

    autorun(() => {      
      this.receipts.setDateRange(this.date, this.date)
    })
  }

  componentWillUnmount() {
    this.receipts.release()
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

  getTableContent() {
    if (this.receipts.isLoading) 
      return <Spinner />
    
    const tableRows = []

    this.receipts.getAll().forEach(receipt => {
      tableRows.push(
        <ReceiptArchiveRow
          key={receipt.id}
          receipt={receipt}  
          isSelected={receipt === this.selectedReceipt}                     
          onClick={this.handleReceiptClick} 
        />)
    })

    return (
      <tbody>
        {...tableRows}
      </tbody>
    )
  }

  getExpandComponent(receipt) {    
    return <ExpandedReceiptArchiveRow receipt={receipt} />
  }

  getPrice(cell, receipt) {
    return <span style={{height: '48px'}}>{formatPrice(receipt.totalPrice)} €</span>
  }

  render() {        
    const tableOptions = {
      noDataText: 'Keine Belege vorhanden',
      expandRowBgColor: '#eee'


    }


    return (
      <div>
        <Toolbar>
          {this.props.navigation}          
          <Buttons>
            <Button onClick={this.handlePreviousDayClick}><Icon icon="chevron-left" /></Button>
            <Button onClick={this.handleNextDayClick}><Icon icon="chevron-right" /></Button>
            <DatePicker
              selectedDate={this.date}
              onChange={this.handleDateChange}
            />
          </Buttons>
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
            <TableHeaderColumn dataField='id' isKey>Belegnummer</TableHeaderColumn>
            <TableHeaderColumn dataField='totalQuantity' width={200} dataAlign="right">Menge</TableHeaderColumn>
            <TableHeaderColumn dataField='totalPrice' width={200} dataAlign="right" dataFormat={this.getPrice}>Belegsumme</TableHeaderColumn>          
          </BootstrapTable>                                              
        }
      </div>            
      )
  }
}