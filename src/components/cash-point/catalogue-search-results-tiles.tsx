import * as React from 'react'
import { observer, inject } from 'mobx-react'

import { CatalogueProductTile, CatalogueBackTile } from './catalogue-tile'
import { ProductStore } from '../../domain/product-store'
import { Icon } from '../shared/ui'

interface SearchResultsTilesProps {
    searchTerm: string
    onNavigateBack
    onProductSelected
    productStore?: ProductStore
}

@inject('productStore') @observer
export default class SearchResultsTiles extends React.Component<SearchResultsTilesProps, {}> {
    render() {        
        const products = this.props.productStore.searchProducts(this.props.searchTerm)

        let tiles = products.map((product, idx) => {
            return (
                <CatalogueProductTile
                    key={idx}                    
                    product={product}                    
                    onClick={ this.handleProductClick }                
                />
            )
        })

        const backTile = <CatalogueBackTile onClick={ this.handleBackClick } />                

        tiles = [backTile, ...tiles]
         
        return (                       
            <div className='catalogue-tile-layout'>
                { ...tiles }
            </div>
        )
    }

    handleProductClick = (product) => {
        this.props.onProductSelected(product)
    }

    handleBackClick = (idx) => {
        this.props.onNavigateBack()
    }        
}