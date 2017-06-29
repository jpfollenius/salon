import * as React from 'react'
import { autorun, observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import { CatalogueProductTile, CatalogueBackTile } from './catalogue-tile'
import { ProductStore } from '../../domain/product-store'
import { Icon } from '../shared/ui'
import { CatalogueStore, CatalogueCategory, CatalogueItem } from '../../domain/catalogue-store'

interface CatalogueCategoryProductsTilesProps {
    category: CatalogueCategory
    onNavigateBack
    onProductSelected
    productStore?: ProductStore
    catalogueStore?: CatalogueStore
}

@inject('productStore') @inject('catalogueStore') @observer
export default class CatalogueCategoryProductsTiles extends React.Component<CatalogueCategoryProductsTilesProps, {}> {   
    @observable items: CatalogueItem[] = []
    cleanupAutorun

    @action setItems(items: CatalogueItem[]) {
        this.items = items
    }

    componentWillMount() {
        this.cleanupAutorun = autorun(() => {
            if (this.props.category) {                
                this.props.catalogueStore.getCategoryContent(this.props.category).then(this.setItems.bind(this)) 
            }
        })        
    }

    componentWillUnmount() {
        this.cleanupAutorun()
    }

    render() {   
        let tiles = this.items.map((item, idx) => {
            return (
                <CatalogueProductTile
                    key={idx}    
                    product={item.product}                                    
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

    handleBackClick = () => {
        this.props.onNavigateBack()
    }
}
