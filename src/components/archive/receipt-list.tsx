import * as React from 'react'
import { observable, action, autorun } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as moment from 'moment'
import * as Table from 'react-bootstrap/lib/Table'
import { Scrollbars } from 'react-custom-scrollbars'

import { formatPrice } from '../../utils/utils'
import { ReceiptStore, Receipts, Receipt } from '../../domain/receipt-store'
import { Toolbar, Buttons, Button, Icon, DatePicker, Spinner, Card } from '../shared/ui'
import ReceiptDetails from './receipt-details'
import commonStyles from '../../styles'

const styles = {
  layout: {
    display: 'flex',
  },
  scrollContainer: {
    width: '100%', 
    height: 'calc(100% - 60px)',
  },
  list: {
    height: '100%',
  },
  toolbar: {
    marginBottom: '20px',
    borderBottom: 'none',    
  },
  receiptDetails: {
    width: '450px',
    flexShrink: 0,
    marginLeft: '20px',
    transition: 'all 300ms linear',
  }
}

interface ReceiptListProps {  
  receiptStore?: ReceiptStore  
  onReceiptClick?: (Receipt) => void
}

@inject('receiptStore') @observer
export default class ReceiptList extends React.Component<ReceiptListProps, {}> { 
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
    this.selectedReceipt = undefined
  }

  @action handlePreviousDayClick = () => {
    this.date = moment(this.date).subtract(1, 'day').toDate()
    this.selectedReceipt = undefined
  }

  @action handleNextDayClick = () => {
    this.date = moment(this.date).add(1, 'day').toDate()
    this.selectedReceipt = undefined
  }

  @action handleReceiptClick = (receipt) => {
    this.selectedReceipt = (receipt === this.selectedReceipt) ? undefined : receipt
    
    if (this.props.onReceiptClick) {
      this.props.onReceiptClick(receipt)
    }
  }  

  render() {        
    return (      
      <Card style={styles.list}>
        <Toolbar style={styles.toolbar}>            
          <DatePicker
            selectedDate={this.date}
            onChange={this.handleDateChange}
          />          
        </Toolbar>  

        <Scrollbars autoHide style={styles.scrollContainer}>     
          <Table>
            <thead>
              <tr>
                <th>Belegnummer</th>
                <th>Zeit</th>
                <th>Mitarbeiter</th>
                <th>Kunde</th>
                <th>Bar</th>
                <th>EC</th>
                <th>Belegsumme</th>
              </tr>
            </thead>
            <tbody>
              {this.receipts.getAll().map(receipt => {
                const isSelected = (this.selectedReceipt === receipt)
                const rowClass = isSelected ? 'active' : ''               

                return (
                  <tr className={rowClass} onClick={() => this.handleReceiptClick(receipt)}>
                    <td>{receipt.number}</td>
                    <td>{moment(receipt.date).format('HH:mm')}</td>
                    <td></td>
                    <td>{receipt.customer ? receipt.customer.fullName : ''}</td>
                    <td></td>
                    <td></td>
                    <td>{formatPrice(receipt.totalPrice)} €</td>
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