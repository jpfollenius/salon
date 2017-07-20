import * as React from 'react'
import { computed, observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import { CustomerStore, Customer } from '../../domain/customer-store'
import { ReceiptStore, Receipt } from '../../domain/receipt-store'
import { Card } from '../shared/ui'
import ReceiptList from './receipt-list'
import ReceiptDetails from './receipt-details'

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
  layoutReceiptSelected: {
    transform: 'translate(-25vw) translate(-20px)',
    transition: 'transform 300ms ease-in-out',
  },
  layoutNoReceiptSelected: {
    transform: 'translate(0)',
    transition: 'transform 300ms ease-in-out',
  },
  navigation: {    
    width: '25vw',    
  },
  receiptList: {
    padding: '0 20px',
    width: 'calc(75vw - 20px)',    
  },
  receiptDetails: {        
    width: '25vw',
  },
}

interface ReceiptArchiveProps {
  navigation: JSX.Element
}

@inject('customerStore') @observer
export default class ReceiptArchive extends React.Component<ReceiptArchiveProps, {}> {
  @observable selectedReceipt: Receipt = undefined

  @action handleReceiptClick = (receipt) => {
    this.selectedReceipt = (receipt === this.selectedReceipt) ? undefined : receipt
  }

  @action handleDetailsClose = () => {
    this.selectedReceipt = undefined
  }
  
  render() {
    let layoutStyle = {
      ...styles.layout, 
      ...(this.selectedReceipt ? styles.layoutReceiptSelected : styles.layoutNoReceiptSelected)
    }    

    return (
      <div style={styles.container}>
        <div style={layoutStyle}>
          <Card style={styles.navigation}>            
            {this.props.navigation}
          </Card>   

          <div style={styles.receiptList}>
            <ReceiptList
              onReceiptClick={this.handleReceiptClick}
            />
          </div>
          
          <div style={styles.receiptDetails}>
            { this.selectedReceipt &&  
              <ReceiptDetails
                receipt={this.selectedReceipt}
                onClose={this.handleDetailsClose}
              />              
            }
          </div>
        </div>
      </div>
    )
  }
}