import * as React from 'react'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import * as Table from 'react-bootstrap/lib/Table'
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import * as FormControl from 'react-bootstrap/lib/FormControl'

import { Receipt, ReceiptItem } from '../../domain/receipt-store'
import { formatPrice } from '../../utils/utils'
import { ViewState } from '../../domain/view-state'
import { Button, Buttons } from '../shared/ui'
import * as TransitionGroup from 'react-addons-css-transition-group'

const styles = {
    buttons: {
        marginTop: '40px',
    }
}

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
                <td style={{width: 100}} className='col-right'>{ receiptItem.quantity }</td>
                <td style={{width: 100}} className='col-right'>{ formatPrice(receiptItem.price) } €</td>
                <td style={{width: 100}} className='col-right col-highlighted'>{ formatPrice(receiptItem.totalPrice) } €</td>                        
            </tr>       
        )
    }
}

@observer
class ExpandedReceiptItemView extends React.Component<ReceiptItemViewProps, {}> {
    @observable changedQuantity: number
    
    componentWillMount() {
        this.changedQuantity = this.props.receiptItem.quantity
    }

    render() { 
        const receiptItem = this.props.receiptItem

        return (
            <tr key={this.props.idx} onClick={ (e) => {if (!e.defaultPrevented) this.props.onClick(this.props.idx)} }>                        
                <td>
                    <p>{ receiptItem.product.name }</p>                            
                    <ButtonToolbar>
                        <Button danger onClick={ this.handleDeleteClick }>Löschen</Button>
                        <Button>Preis ändern</Button>
                        <Button>Retoure</Button>                        
                    </ButtonToolbar>
                </td>
                <td style={{width: 100}} className='col-right'>                    
                    <FormControl 
                        onClick={(e) => {e.defaultPrevented = true}}
                        className='pull-right number-edit' 
                        type='number' 
                        value={ this.changedQuantity } 
                        onChange={ this.handleQuantityChange }
                    />                                     
                </td>
                <td style={{width: 100}} className='col-right'>{ formatPrice(receiptItem.price) } €</td>          
                <td style={{width: 100}} className='col-right col-highlighted'>{ receiptItem.totalPrice } €</td>                        
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
                <Table hover condensed bordered striped className='receipt-table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th style={{width: 100}} className='col-right'>Anzahl</th>
                            <th style={{width: 100}} className='col-right'>Einzelpreis</th>
                            <th style={{width: 100}} className='col-right'>Preis</th>                        
                        </tr>
                    </thead>
                    <tbody>
                        {...rows}                        
                    </tbody>
                </Table>
                <div className='total-price'>
                    { formatPrice(this.props.receipt.totalPrice) } €
                </div>                
            </div>
        )
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

    handleSubmit = () => {
        // TODO
        this.props.receipt.clear()
        this.props.viewState.closeModal()
    }
}