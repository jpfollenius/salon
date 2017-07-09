import * as React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import Catalogue from './catalogue'
import ReceiptView from './receipt-view'
import PaymentDetails from './payment-details'
import { Button, Buttons, Toolbar, Card } from '../shared/ui'
import { ViewState } from '../../domain/view-state'
import { ProductStore } from '../../domain/product-store'
import { ReceiptStore } from '../../domain/receipt-store'

const styles = {
    container: {
        overflowX: 'hidden',
    },
    layout: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        height: '100%',
        width: 'calc(100% + 480px)',
        margin: '40px',        
        flexWrap: 'wrap',   
        overflowY: 'scroll',
        overflowX: 'hidden', 
    },
    toolbar: {
        borderBottom: 'none'
    },
    catalogue: {        
        width: '542px',        
        marginRight: '20px',   
        minHeight: 'calc(100vh - 180px)',
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
        flexGrow: 1,                
    },
    paymentDetails: {
        width: '520px',       
        marginLeft: '20px',                      
    },
    paymentDetailsExpanded: {     
        opacity: 1,
        transform: 'translate(-560px)',        
        transition: 'transform 300ms' ,
    },
    paymentDetailsCollapsed: {
        opacity: 0,        
        transform: 'translate(0)',        
        transition: 'transform 300ms',       
    },
}

enum PaymentStage {
    CustomerSelection,
    ReceiptEditing,
    EmployeeSelection,
    Payment,
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
            <div style={styles.container}>
                {/*<Toolbar style={styles.toolbar}>                
                    <div></div>
                    <div>
                        <Buttons>                        
                            <Button>Einzahlung</Button>
                            <Button>Entnahme</Button>
                            <Button primary>Tagesabschluss</Button>
                        </Buttons>
                    </div>
                </Toolbar>*/}

                <div style={styles.layout}>                    
                    <Card style={catalogueStyle}>
                        <Catalogue 
                            onProductSelected={ this.handleProductSelected }/>
                    </Card>                      
                    
                    <Card style={receiptStyle}>
                        <ReceiptView 
                            receipt={ receipt } 
                            canPay={!this.isInPayment} 
                            onPay={ this.handlePayment } />
                    </Card>
                    
                    <Card style={paymentDetailsStyle}>
                        <PaymentDetails 
                            amount={ receipt.totalPrice }
                            onBack={ this.handlePaymentCancelled }
                            onSubmit={ this.handlePaymentFinished }                        
                        />                    
                    </Card>                        
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
        store.addReceipt(this.props.viewState.currentReceipt)        
        this.props.viewState.currentReceipt.clear()
        this.isInPayment = false
    }

    @action handlePaymentCancelled = () => {
        this.isInPayment = false
    }
}