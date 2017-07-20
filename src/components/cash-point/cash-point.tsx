import * as React from 'react'
import { observable, action, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import { ApAnalogClock, ApAnalogClockStyle } from 'apeman-react-clock'
import * as moment from 'moment'

import Catalogue from './catalogue'
import ReceiptView from './receipt-view'
import PaymentDetails from './payment-details'
import { Button, Buttons, Toolbar, Card, CardTitle } from '../shared/ui'
import { ViewState } from '../../domain/view-state'
import { ProductStore } from '../../domain/product-store'
import { ReceiptStore } from '../../domain/receipt-store'
import PaymentProcess from './payment-process'
import commonStyles from '../../styles'

const styles = {
    container: {
        overflowX: 'hidden',                   
        position: 'absolute',
        top: 40,
        left: 0,
        margin: '40px 30px',        
    },
    layout: {                
        margin: 20,               
        display: 'flex',        
        justifyContent: 'center',
        alignItems: 'stretch',        
        overflowX: 'hidden',  
        minWidth: 'calc(100vw - 80px)',
    },
    layoutItem: {
        minHeight: 'calc(100vh - 90px)',        
    },
    paymentProcess: {
        flexGrow: 1,
        flexShrink: 1,        
    },
    stats: {        
        marginRight: 20,
        minHeight: 'calc(100vh - 90px)',                
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        minWidth: '25%',
        height: '100%',
    },
    toolbar: {
        borderBottom: 'none'
    },        
    catalogue: {        
        width: '462px',        
        marginRight: '40px',         
    },    
    receipt: {        
        flexGrow: 1,
        flexShrink: 1,     
        marginTop: 40,           
    },
    paymentDetails: {
        width: '520px',       
        marginLeft: '20px',                      
    },
    timelineDate: {
        color: '#98a6ad'
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
    @observable paymentStage: PaymentStage = PaymentStage.CustomerSelection
    animateForward: boolean = true
    
    @action handleCustomerSelect = (customer) => {
        this.animateForward = true
        this.props.viewState.currentReceipt.customer = customer        
        this.paymentStage = PaymentStage.ReceiptEditing
    }

    @action handlePaymentCancel = () => {
        this.animateForward = false
        this.props.viewState.currentReceipt.clear()
        this.paymentStage = PaymentStage.CustomerSelection
    }

    render() {        
        const receipt = this.props.viewState.currentReceipt       

        return (    
            <div style={styles.layout}>
                <div style={styles.stats}>
                    <Card>
                        <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                            <div>
                                <ApAnalogClockStyle scoped width={128} height={128} />
                                <ApAnalogClock />
                            </div>
                            <div style={{marginLeft: 40, fontSize: 24}}>
                                <p>{moment().format('dddd')}</p>
                                <p>{moment().format('DD.MM.YY')}</p>
                            </div>
                        </div>
                    </Card>                   
                    <Card style={{flexGrow: 1, marginTop: 20}}>
                        <h3>Nächste Termine</h3>

                        <div className="timeline-2">
                            <div className="time-item">
                                <div className="item-info">
                                <small style={styles.timelineDate}>in 5 Minuten</small>
                                <p>Maximilian Muster</p>
                                <p>Haare schneiden, Föhnen</p>
                                </div>
                            </div>

                            <div className="time-item">
                                <div className="item-info">
                                <small style={styles.timelineDate}>in 25 Minuten</small>
                                <p>Sophie Müller</p>
                                <p>Haare schneiden</p>
                                </div>
                            </div>

                            <div className="time-item">
                                <div className="item-info">
                                <small style={styles.timelineDate}>in 1 Stunde</small>
                                <p>Hans Klein</p>
                                <p>Kopfmassage</p>
                                </div>
                            </div>
                            </div>
                    </Card>
                </div>

                <Card style={{...styles.layoutItem, ...styles.paymentProcess}}>                                       
                    <PaymentProcess                         
                        receipt={this.props.viewState.currentReceipt}
                    />
                </Card>                        
            </div>
        )  
    }

    handleProductSelected = (product) => {        
        const receipt = this.props.viewState.currentReceipt
        receipt.addProduct(product)
    }

    @action handlePayment = () => {
        this.animateForward = true
        this.paymentStage = PaymentStage.Payment
    }

    @action handlePaymentFinished = () => {
        this.animateForward = false
        const store = this.props.receiptStore        
        store.addReceipt(this.props.viewState.currentReceipt)        
        this.props.viewState.currentReceipt.clear()
        this.paymentStage = PaymentStage.CustomerSelection
    }

    @action handlePaymentCancelled = () => {
        this.animateForward = false
        this.paymentStage = PaymentStage.ReceiptEditing
    }
}