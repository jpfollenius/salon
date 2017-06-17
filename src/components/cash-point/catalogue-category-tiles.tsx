import * as React from 'react'
import { inject, observer } from 'mobx-react'

import CatalogueTile from './catalogue-tile'
import {ProductStore} from '../../domain/product-store'

const categoryColors = [
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#f1c40f',
    '#34495e',
    '#c0392b',
    '#16a085',
    '#8e44ad',    
    '#e67e22',
    '#3498db',
    '#9b59b6',
    '#f1c40f',
    '#34495e',
    '#c0392b',
    '#8e44ad',
    '#16a085',
]

const categoryTextColors = [
    'black',
    'black',
    'black',
    'black',
    'white',
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
    'white',
    'black',
    'black',
    'black',
]

interface CatalogueCategoryTilesProps {
    productStore?: ProductStore
    onCategorySelected
}

@inject('productStore') @observer
export default class CatalogueCategoryTiles extends React.Component<CatalogueCategoryTilesProps, {}> {
    render() {        
        const categories = this.props.productStore.getProductCategories()

        const tiles = categories.map((category, idx) => {
            return <CatalogueTile 
                key={idx} 
                id={idx} 
                text={ <span>{ categories[idx] }</span>} 
                bgColor={ categoryColors[idx] } 
                textColor={ categoryTextColors[idx] } 
                onClick={ this.handleCategoryClick } 
            />
        })
        
        return (                       
            <div className='catalogue-tile-layout'>
                { ...tiles }
            </div>
        )
    }

    handleCategoryClick = (idx) => {
        this.props.onCategorySelected(idx)
    }
}
