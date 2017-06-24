import * as React from 'react'
import { observer, inject } from 'mobx-react'

import { ProductStore } from '../../domain/product-store'
import CatalogueTile from './catalogue-tile'

const styles = {
    layout: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        width: '100%',    
        marginTop: '40px',
    }
}

interface CatalogueFavoritesProps {
    productStore?: ProductStore
    onProductSelected
}

@inject('productStore') @observer
export default class CatalogueFavorites extends React.Component<CatalogueFavoritesProps, {}> {
    render() {
        const favoriteProducts = this.props.productStore.getFavoriteProducts(4)

        let tiles = favoriteProducts.map(product => {
            return (
                <CatalogueTile
                    showFavorite
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
                    onClick={ this.props.onProductSelected }                
                />
            )
        })
 
        return (                       
            <div style={styles.layout}>
                { ...tiles }
            </div>
        )        
    }    
}