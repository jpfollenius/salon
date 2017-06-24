import * as React from 'react'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import * as Form from 'react-bootstrap/lib/Form'
import * as FormGroup from 'react-bootstrap/lib/FormGroup'
import * as FormControl from 'react-bootstrap/lib/FormControl'

import CatalogueCategoryTiles from './catalogue-category-tiles'
import CatalogueCategoryProductsTiles from './catalogue-product-tiles'
import SearchResultsTiles from './catalogue-search-results-tiles'
import CatalogueFavorites from './catalogue-favorites'
import { ProductStore } from '../../domain/product-store'

interface CatalogueProps {
    onProductSelected
    productStore?: ProductStore
}

@inject('productStore') @observer
export default class Catalogue extends React.Component<CatalogueProps, {}> {
    @observable searchTerm
    @observable selectedCategory = -1

    render() {        
        return (
            <div>
                { this.selectedCategory === -1 
                    ? 
                        <div>
                            <div className='catalogue-search'>
                                <Form>
                                    <FormGroup>
                                        <FormControl type='text' placeholder='Suchen oder Barcode scannen...' value={ this.searchTerm } onChange={ this.handleSearchTermChange }/>
                                    </FormGroup>

                                </Form>  
                            </div>   

                            { this.searchTerm && this.searchTerm !== '' 
                                ? <SearchResultsTiles searchTerm={this.searchTerm} onNavigateBack={ this.handleSearchBack } onProductSelected={ this.handleProductSelected } />
                                : 
                                    <div>                                        
                                        <CatalogueCategoryTiles onCategorySelected={ this.handleCategorySelected } />                                 
                                        <CatalogueFavorites onProductSelected={ this.handleProductSelected } />
                                    </div>
                            }            
                            
                        </div>
                    : 
                        <div>
                            <p className='title'>{ this.props.productStore.getProductCategories() [this.selectedCategory] }</p>
                            <CatalogueCategoryProductsTiles 
                                category={ this.selectedCategory } 
                                onProductSelected= { this.handleProductSelected } 
                                onNavigateBack={ this.handleCategoryBack }  
                            /> 
                        </div>
                }

            </div>
        )
        
    }

    @action handleSearchTermChange = (e) => {
        const barcodeProduct = this.props.productStore.findProductByBarcode(e.target.value)        
        
        if (barcodeProduct) {            
            this.props.onProductSelected(barcodeProduct.id)
            this.searchTerm = ''
            return
        }
        
        this.searchTerm = e.target.value
    }

    @action handleCategorySelected = (id) => {
        this.selectedCategory = id
    }

    handleProductSelected = (productId) => {
        this.props.onProductSelected(productId)        
    }

    @action handleCategoryBack = () => {
        this.selectedCategory = -1
    }

    @action handleSearchBack = () => {
        this.searchTerm = ''
    }
  
}