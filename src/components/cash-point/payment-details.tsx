import * as React from 'react'
import { computed, observable, action } from 'mobx'
import { observer } from 'mobx-react'

import * as Table from 'react-bootstrap/lib/Table'

import { Button, Buttons, NumberEdit } from '../shared/ui'
import { formatPrice } from '../../utils/utils'
import commonStyles from '../../styles'

const styles = {
    price: {        
        fontSize: '24px',                
    },
    button: {
        width: '100px',
        height: '48px',      
    },
    amountInput: {
        fontSize: '16px',
        height: '48px',  
    },
    separatorRow: {
        height: '20px',
    },
    buttons: {
        marginTop: '40px',
    }
}

interface PaymentDialogProps {
    amount: number
    onSubmit
    onBack
}


@observer
export default class PaymentDetails extends React.Component<PaymentDialogProps, {}> {    
    @observable cashAmount = 0
    @observable debitAmount = 0

    @computed get remainingAmount() {
        return this.props.amount - this.cashAmount - this.debitAmount
    }   

    render() {
        return (
            <div>  
                <h1>Kassieren</h1>                                          

                <Table condensed> 
                    <tbody>
                        <tr>
                            <td>Summe</td>
                            <td style={styles.price}>{formatPrice(this.props.amount)} €</td>
                        </tr>
                        <tr>
                            <td>Gegeben</td>
                            <td style={styles.price}>{formatPrice(this.props.amount - this.remainingAmount)} €</td>
                        </tr>                        
                        <tr>
                            <td>Restbetrag</td>
                            <td style={styles.price}>{formatPrice(this.remainingAmount)} €</td>
                        </tr>  

                        <tr style={styles.separatorRow}></tr>

                        <tr>
                            <td>
                                <Button 
                                    primary                                                                        
                                    style={styles.button} 
                                    onClick={ this.handleCashClick }
                                >
                                    Bar
                                </Button>
                            </td>
                            <td>
                                <NumberEdit 
                                    style={styles.amountInput}                                     
                                    value={ this.cashAmount } 
                                    onChange={ this.handleCashChange } 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <Button 
                                    primary                                    
                                    style={styles.button} 
                                    onClick={ this.handleDebitClick }
                                >
                                    EC
                                </Button>
                            </td>
                            <td>
                                <NumberEdit                                
                                    style={styles.amountInput}                                     
                                    value={ this.debitAmount } 
                                    onChange={ this.handleDebitChange } 
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>             
                
                <Buttons rightAligned style={styles.buttons}>
                    <Button onClick={ this.handleBack }>Zurück</Button>
                    <Button success onClick={ this.handleSubmit }>Bezahlt</Button>                    
                </Buttons>        
            </div>
        )                
    }

    @action handleCashClick = () => {
        if (this.remainingAmount === 0) {
            this.debitAmount = 0
            this.cashAmount = this.props.amount
        } else {
            this.cashAmount = this.remainingAmount
        }
    }

    @action handleDebitClick = () => {
        if (this.remainingAmount === 0) {
            this.cashAmount = 0
            this.debitAmount = this.props.amount
        } else {
            this.debitAmount = this.remainingAmount
        }        
    }

    @action handleCashChange = (e) => {
        this.cashAmount = e.target.value
    }

    @action handleDebitChange = (e) => {
        this.debitAmount = e.target.value
    }

    @action clear() {
        this.debitAmount = 0
        this.cashAmount = 0        
    }

    handleBack = () => {
        this.clear()
        this.props.onBack()
    }

    handleSubmit = () => {
        this.clear()
        this.props.onSubmit()
    }

}
