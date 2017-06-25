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
import { CatalogueStore, CatalogueCategory } from '../../domain/catalogue-store'

interface CatalogueProps {
    onProductSelected
    productStore?: ProductStore
    catalogueStore?: CatalogueStore
}

@inject('productStore') @inject('catalogueStore') @observer
export default class Catalogue extends React.Component<CatalogueProps, {}> {
    @observable searchTerm
    @observable selectedCategory: CatalogueCategory = undefined

    render() {        
        return (
            <div>
                { this.selectedCategory === undefined
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
                                        <CatalogueCategoryTiles 
                                            categories={ this.props.catalogueStore.getCategories() }
                                            onCategorySelected={ this.handleCategorySelected } 
                                        />                                 
                                        <CatalogueFavorites onProductSelected={ this.handleProductSelected } />
                                    </div>
                            }            
                            
                        </div>
                    : 
                        <div>
                            <p className='title'>{ this.selectedCategory.name }</p>
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
            this.props.onProductSelected(barcodeProduct)
            this.searchTerm = ''
            return
        }
        
        this.searchTerm = e.target.value
    }

    @action handleCategorySelected = (category) => {
        this.selectedCategory = category
    }

    handleProductSelected = (product) => {
        this.props.onProductSelected(product)        
    }

    @action handleCategoryBack = () => {
        this.selectedCategory = undefined
    }

    @action handleSearchBack = () => {
        this.searchTerm = ''
    }
  
}