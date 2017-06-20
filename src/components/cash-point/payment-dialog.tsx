import * as React from 'react'
import { computed, observable, action } from 'mobx'
import { observer } from 'mobx-react'

import * as Form from 'react-bootstrap/lib/Form'
import * as FormGroup from 'react-bootstrap/lib/FormGroup'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as Button from 'react-bootstrap/lib/Button'
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import * as Table from 'react-bootstrap/lib/Table'
import * as Modal from 'react-bootstrap/lib/Modal'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'

import { formatPrice } from '../../utils/utils'
import commonStyles from '../../styles'

interface PaymentDialogProps {
    amount: number
    onSubmit
}

const styles = {
    remainingAmount: {        
        fontSize: '24px',
        color: 'green',        
    },
    button: {
        width: '100px',
        height: '48px',      
    },
    amountInput: {
        fontSize: '16px',
        height: '48px',  
    },
    successIcon: {
        ...commonStyles.buttonIcon,
        color: 'green'
    },
    successMessage: {
        marginLeft: '5px',
        marginTop: '5px',
    }
}

@observer
export default class PaymentDialog extends React.Component<PaymentDialogProps, {}> {    
    @observable cashAmount = 0
    @observable debitAmount = 0
    @observable isPaid = false

    @computed get remainingAmount() {
        return this.props.amount - this.cashAmount - this.debitAmount
    }   

    render() {
        return (
            <Form>                
                <Modal.Body>
                    <Table condensed> 
                        <tbody>
                            <tr>
                                <td></td>
                                <td>
                                    <span style={styles.remainingAmount}>
                                        { formatPrice(this.remainingAmount) } €
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Button 
                                        bsStyle='primary' 
                                        disabled={this.isPaid} 
                                        style={styles.button} 
                                        onClick={ this.handleCashClick }
                                    >
                                        Bar
                                    </Button>
                                </td>
                                <td>
                                    <FormControl 
                                        style={styles.amountInput} 
                                        type='number' 
                                        disabled={this.isPaid} 
                                        value={ this.cashAmount } 
                                        onChange={ this.handleCashChange } 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Button 
                                        bsStyle='primary' 
                                        disabled={this.isPaid} 
                                        style={styles.button} 
                                        onClick={ this.handleDebitClick }
                                    >
                                        EC
                                    </Button>
                                </td>
                                <td>
                                    <FormControl 
                                        style={styles.amountInput} 
                                        type='number' 
                                        disabled={this.isPaid} 
                                        value={ this.debitAmount } 
                                        onChange={ this.handleDebitChange } 
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </Table>            
                </Modal.Body>
                <Modal.Footer>
                    { this.isPaid
                        ?     
                            <div> 
                                <div className='pull-left' style={styles.successMessage}>
                                    <Glyphicon glyph='ok' style={styles.successIcon} />Beleg wurde gebucht           
                                </div>
                                <ButtonToolbar className='pull-right'>
                                    <Button>
                                        <Glyphicon style={commonStyles.buttonIcon} glyph='print' />Bon drucken
                                    </Button>
                                    <Button bsStyle='primary' onClick={this.props.onSubmit}>
                                        Fertig
                                    </Button>
                                </ButtonToolbar>
                            </div>
                        : <Button bsStyle='success' onClick={ this.handlePayedClick }>Bezahlt</Button>                    
                    }
                    
                </Modal.Footer>
            </Form>
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

    @action handlePayedClick = () => {
        this.isPaid = true
    }

}
