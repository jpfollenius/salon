import * as React from 'react'
import { observer, inject } from 'mobx-react'

import * as Button from 'react-bootstrap/lib/Button'
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'

import Catalogue from './catalogue'
import ReceiptView from './receipt-view'
import { ViewState } from '../../domain/view-state'
import { ProductStore } from '../../domain/product-store'

interface CashPointProps {
    viewState?: ViewState
    productStore?: ProductStore
}

@inject('viewState', 'productStore') @observer
export default class CashPoint extends React.Component<CashPointProps, {}> {
    render() {
        return (
            <div>
                <div className='toolbar'>
                    <div></div>
                    <div>
                        <ButtonToolbar>
                            <Button bsStyle='primary'>Tagesabschluss</Button>
                        </ButtonToolbar>
                    </div>
                </div>
                <div className='cashpoint-layout'>
                    <div className='cashpoint-catalogue'>
                        <Catalogue onProductSelected={ this.handleProductSelected }/>
                    </div>
                    <div className='cashpoint-bill'>
                        <ReceiptView receipt={ this.props.viewState.currentReceipt } />
                    </div>
                </div>
            </div>
        )
    }

    handleProductSelected = (productId) => {
        const store = this.props.productStore
        const receipt = this.props.viewState.currentReceipt
        const product = store.getProduct(productId)

        receipt.addProduct(product)
    }
}