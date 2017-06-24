import * as React from 'react'
import { inject, observer } from 'mobx-react'

import CatalogueTile from './catalogue-tile'
import { ProductStore } from '../../domain/product-store'
import { Icon } from '../shared/ui'

interface CatalogueCategoryProductsTilesProps {
    category: number
    onNavigateBack
    onProductSelected
    productStore?: ProductStore
}

@inject('productStore') @observer
export default class CatalogueCategoryProductsTiles extends React.Component<CatalogueCategoryProductsTilesProps, {}> {    
    render() {      
        const products = this.props.productStore.getProducts(this.props.category)

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
                text={ <Icon icon='arrow-left' style={{fontSize: '24px'}} /> }
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
