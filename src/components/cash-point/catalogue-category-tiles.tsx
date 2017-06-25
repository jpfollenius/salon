import * as React from 'react'
import { inject, observer } from 'mobx-react'

import { CatalogueCategoryTile } from './catalogue-tile'
import {ProductStore} from '../../domain/product-store'
import { CatalogueCategory } from '../../domain/catalogue-store'

interface CatalogueCategoryTilesProps {
    productStore?: ProductStore
    onCategorySelected,
    categories: CatalogueCategory[]
}

@inject('productStore') @observer
export default class CatalogueCategoryTiles extends React.Component<CatalogueCategoryTilesProps, {}> {
    render() {        
        const categories = this.props.categories

        const tiles = categories.map((category, idx) => {
            return <CatalogueCategoryTile
                        key={idx} 
                        category={category}                        
                        onClick={ this.handleCategoryClick } 
                    />
        })
        
        return (                       
            <div className='catalogue-tile-layout'>
                { ...tiles }
            </div>
        )
    }

    handleCategoryClick = (category) => {        
        this.props.onCategorySelected(category)
    }
}
