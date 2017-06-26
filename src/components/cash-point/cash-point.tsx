import * as React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import Catalogue from './catalogue'
import ReceiptView from './receipt-view'
import PaymentDetails from './payment-details'
import { Button, Buttons, Toolbar } from '../shared/ui'
import { ViewState } from '../../domain/view-state'
import { ProductStore } from '../../domain/product-store'
import { ReceiptStore } from '../../domain/receipt-store'

const styles = {
    layout: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '100%',
        width: 'calc(100% + 520px)',
        marginLeft: '20px',
        marginTop: '20px',
        marginRight: '20px',
        flexWrap: 'wrap',    
    },
    catalogue: {
        padding: '10px',
        width: '520px',        
        marginRight: '40px',   
    },
    catalogueExpanded: {                        
        transform: 'translate(0)',
        transition: 'transform 300ms',        
    },
    catalogueCollapsed: {        
        transform: 'translate(-560px)',
        transition: 'transform 300ms',
    },    
    receipt: {
        padding: '10px',
        flexGrow: 1,        
        marginTop: '30px',
    },
    paymentDetails: {
        width: '520px',       
        marginLeft: '40px',        
        paddingLeft: '40px',        
    },
    paymentDetailsExpanded: {     
        transform: 'translate(-560px)',        
        transition: 'all 300ms' ,
    },
    paymentDetailsCollapsed: {        
        transform: 'translate(0)',        
        transition: 'all 300ms',       
    },
}

interface CashPointProps {
    viewState?: ViewState
    productStore?: ProductStore
    receiptStore?: ReceiptStore
}

@inject('viewState', 'productStore', 'receiptStore') @observer
export default class CashPoint extends React.Component<CashPointProps, {}> {
    @observable isInPayment

    render() {
        const catalogueStyle = {...styles.catalogue, ...this.isInPayment ? styles.catalogueCollapsed : styles.catalogueExpanded}
        const paymentDetailsStyle = {...styles.paymentDetails, ...this.isInPayment ? styles.paymentDetailsExpanded : styles.paymentDetailsCollapsed}
        const receiptStyle = {...styles.receipt, ...this.isInPayment ? styles.catalogueCollapsed : styles.catalogueExpanded}
        const receipt = this.props.viewState.currentReceipt

        return (
            <div>
                <Toolbar>                
                    <div></div>
                    <div>
                        <Buttons>                        
                            <Button>Einzahlung</Button>
                            <Button>Entnahme</Button>
                            <Button primary>Tagesabschluss</Button>
                        </Buttons>
                    </div>
                </Toolbar>

                <div style={styles.layout}>                    
                    <div style={catalogueStyle}>
                        <Catalogue 
                            onProductSelected={ this.handleProductSelected }/>
                    </div>                      
                    
                    <div style={receiptStyle}>
                        <ReceiptView 
                            receipt={ receipt } 
                            canPay={!this.isInPayment} 
                            onPay={ this.handlePayment } />
                    </div>
                    
                    <div style={paymentDetailsStyle}>
                        <PaymentDetails 
                            amount={ receipt.totalPrice }
                            onBack={ this.handlePaymentCancelled }
                            onSubmit={ this.handlePaymentFinished }                        
                        />                    
                    </div>                        
                </div>
            </div>
        )
    }

    handleProductSelected = (product) => {        
        const receipt = this.props.viewState.currentReceipt
        receipt.addProduct(product)
    }

    @action handlePayment = () => {
        this.isInPayment = true
    }

    @action handlePaymentFinished = () => {
        const store = this.props.receiptStore
        console.log('add receipt ', this.props.viewState.currentReceipt)
        store.addReceipt(this.props.viewState.currentReceipt)        
        this.props.viewState.currentReceipt.clear()
        this.isInPayment = false
    }

    @action handlePaymentCancelled = () => {
        this.isInPayment = false
    }
}