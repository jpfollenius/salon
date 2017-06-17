import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import * as Table from 'react-bootstrap/lib/Table'
import * as Button from 'react-bootstrap/lib/Button'
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import * as FormControl from 'react-bootstrap/lib/FormControl'

import { Receipt, ReceiptItem } from '../../domain/receipt-store'
import { formatPrice } from '../../utils/utils'

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
            <tr key={this.props.idx} onClick={ (e) => {console.log(e); this.props.onClick(this.props.idx)} }>                        
                <td>{ receiptItem.product.name }</td>
                <td className='col-right'>{ receiptItem.quantity }</td>
                <td className='col-right'>{ formatPrice(receiptItem.price) } €</td>
                <td className='col-right'>{ formatPrice(receiptItem.totalPrice) } €</td>                        
            </tr>       
        )
    }
}

@observer
class ExpandedReceiptItemView extends React.Component<ReceiptItemViewProps, {}> {
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
                        value={ receiptItem.quantity } 
                        onChange={ this.handleQuantityChange }
                    />
                </td>
                <td className='col-right'>
                    <FormControl 
                        onClick={(e) => {e.defaultPrevented = true}}
                        className='pull-right number-edit' 
                        type='number' 
                        value={ formatPrice(receiptItem.price) } 
                        onChange={ this.handlePriceChange }                    
                    />
                </td>
                <td className='col-right'>{ receiptItem.totalPrice } €</td>                        
            </tr>             
        )
    }

    @action handleQuantityChange = (e) => {
        if (e.target.value > 0)
            this.props.receiptItem.quantity = e.target.value
    }

    @action handlePriceChange = (e) => {
        if (e.target.value >= 0)
            this.props.receiptItem.price = e.target.value
    }

    @action handleDeleteClick = (e) => {
        e.defaultPrevented = true
        this.props.onDeleteItem(this.props.idx)
    }
}

interface ReceiptViewProps {
    receipt: Receipt    
}

@observer
export default class ReceiptView extends React.Component<ReceiptViewProps, {}> {
    @observable selectedRow = -1

    render() {          
        const rows = this.props.receipt.items.map((receiptItem, idx) => {
            return (idx === this.selectedRow)
                ?  <ExpandedReceiptItemView idx={idx} receiptItem={receiptItem} onDeleteItem={(idx) => this.handleItemDelete(idx)} onClick={(idx) => this.handleRowClick(idx)} />                
                :  <ReceiptItemView idx={idx} receiptItem={receiptItem} onClick={(idx) => this.handleRowClick(idx)} />            
        })

        return (
            <div>
                <Table responsive hover striped className='receipt-table'>
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
                        <Button bsStyle='primary'>Kassieren</Button>                    
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
}