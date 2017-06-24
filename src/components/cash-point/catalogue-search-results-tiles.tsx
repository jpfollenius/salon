import * as React from 'react'
import { observer, inject } from 'mobx-react'

import CatalogueTile from './catalogue-tile'
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

        let tiles = products.map(product => {
            return (
                <CatalogueTile
                    key={product.id}                    
                    id={product.id}
                    bgColor='#2c3e50'
                    textColor='white'
                    text={ 
                        <div>                            
                            <p className='catalogue-text'>{ product.name }</p> 
                            <p className='catalogue-price'>{ product.price + ' €' }</p>
                        </div>
                    }
                    onClick={ this.handleProductClick }                
                />
            )
        })

        const backTile = 
            <CatalogueTile
                key={-1}
                id={-1}
                bgColor='#2ecc71'
                textColor='white'
                text={ <Icon style={{fontSize: '24px'}} icon='arrow-left' /> }
                onClick={ this.handleBackClick }                  

            />

        tiles = [backTile, ...tiles]
         
        return (                       
            <div className='catalogue-tile-layout'>
                { ...tiles }
            </div>
        )
    }

    handleProductClick = (productId) => {
        this.props.onProductSelected(productId)
    }

    handleBackClick = (idx) => {
        this.props.onNavigateBack()
    }        
}