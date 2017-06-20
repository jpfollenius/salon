import * as React from 'react'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import * as Table from 'react-bootstrap/lib/Table'
import * as Button from 'react-bootstrap/lib/Button'
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import * as FormControl from 'react-bootstrap/lib/FormControl'

import { Receipt, ReceiptItem } from '../../domain/receipt-store'
import { formatPrice } from '../../utils/utils'
import { ViewState } from '../../domain/view-state'
import PaymentDialog from './payment-dialog'

interface ReceiptItemViewProps {
    idx: number
    receiptItem: ReceiptItem
    onClick?
    onDeleteItem?    
}

@observer
class ReceiptItemView extends React.Component<ReceiptItemViewProps, {}> {
    render() {
        const receiptItem = this.props.receiptItem

        return (
            <tr className='receipt-row' onClick={ (e) => {this.props.onClick(this.props.idx)} }>                        
                <td>{ receiptItem.product.name }</td>
                <td className='col-right'>{ receiptItem.quantity }</td>
                <td className='col-right'>{ formatPrice(receiptItem.price) } €</td>
                <td className='col-right col-highlighted'>{ formatPrice(receiptItem.totalPrice) } €</td>                        
            </tr>       
        )
    }
}

@observer
class ExpandedReceiptItemView extends React.Component<ReceiptItemViewProps, {}> {
    @observable changedQuantity: number
    @observable changedPrice: number

    componentWillMount() {
        this.changedQuantity = this.props.receiptItem.quantity
        this.changedPrice = this.props.receiptItem.price
    }

    render() { 
        const receiptItem = this.props.receiptItem

        return (
            <tr key={this.props.idx} onClick={ (e) => {if (!e.defaultPrevented) this.props.onClick(this.props.idx)} }>                        
                <td>
                    <p>{ receiptItem.product.name }</p>                            
                    <ButtonToolbar>
                        <Button bsStyle='danger' onClick={ this.handleDeleteClick }>Löschen</Button>
                        <Button>Retoure</Button>
                    </ButtonToolbar>
                </td>
                <td className='col-right'>                    
                    <FormControl 
                        onClick={(e) => {e.defaultPrevented = true}}
                        className='pull-right number-edit' 
                        type='number' 
                        value={ this.changedQuantity } 
                        onChange={ this.handleQuantityChange }
                    />                                     
                </td>
                <td className='col-right'>
                    <FormControl 
                        onClick={(e) => {e.defaultPrevented = true}}
                        className='pull-right number-edit' 
                        type='number' 
                        value={ formatPrice(this.changedPrice) } 
                        onChange={ this.handlePriceChange }                    
                    />
                </td>
                <td className='col-right col-highlighted'>{ receiptItem.totalPrice } €</td>                        
            </tr>             
        )
    }

    @action handleQuantityChange = (e) => {        
        if (e.target.value && e.target.value <= 0)
            return

        this.changedQuantity = e.target.value
        if (this.changedQuantity)
            this.props.receiptItem.quantity = this.changedQuantity        
    }

    @action handlePriceChange = (e) => {
        if (e.target.value && e.target.value < 0)
            return

        this.changedPrice = e.target.value
        if (this.changedPrice)
            this.props.receiptItem.price = this.changedPrice        
    }

    @action handleDeleteClick = (e) => {
        e.defaultPrevented = true
        this.props.onDeleteItem(this.props.idx)
    }
}

interface ReceiptViewProps {
    receipt: Receipt  
    viewState?: ViewState  
}

@inject('viewState')  @observer
export default class ReceiptView extends React.Component<ReceiptViewProps, {}> {
    @observable selectedRow = -1

    render() {          
        const rows = this.props.receipt.items.map((receiptItem, idx) => {
            return (idx === this.selectedRow)
                ?  <ExpandedReceiptItemView key={idx} idx={idx} receiptItem={receiptItem} onDeleteItem={(idx) => this.handleItemDelete(idx)} onClick={(idx) => this.handleRowClick(idx)} />                
                :  <ReceiptItemView key={idx} idx={idx} receiptItem={receiptItem} onClick={(idx) => this.handleRowClick(idx)} />            
        })

        return (
            <div>
                <Table responsive hover condensed striped className='receipt-table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th className='col-right'>Anzahl</th>
                            <th className='col-right'>Einzelpreis</th>
                            <th className='col-right'>Preis</th>                        
                        </tr>
                    </thead>
                    <tbody>
                        {...rows}                        
                    </tbody>
                </Table>
                <div className='total-price'>
                    { formatPrice(this.props.receipt.totalPrice) } €
                </div>
                <div className='cashpoint-buttons'>
                    <ButtonToolbar>
                        <Button onClick={ this.handleDiscardClick }>Verwerfen</Button>
                        <Button bsStyle='primary' onClick={ this.handlePayment }>Kassieren</Button>                    
                    </ButtonToolbar>
                </div>
            </div>
        )
    }

    handleDiscardClick = () => {
        this.props.receipt.clear()
    }

    @action handleRowClick(idx) {
        if (idx === this.selectedRow) {
            this.selectedRow = -1
        } else {
            this.selectedRow = idx    
        }        
    }

    @action handleItemDelete(idx) {
        this.props.receipt.deleteItem(idx)
        this.selectedRow = -1
    }

    @action handlePayment = () => {
        this.props.viewState.showModal('Kassieren', <PaymentDialog amount={this.props.receipt.totalPrice} onSubmit={ this.handleSubmit } />)
    }

    handleSubmit = () => {
        // TODO
        this.props.receipt.clear()
        this.props.viewState.closeModal()
    }
}