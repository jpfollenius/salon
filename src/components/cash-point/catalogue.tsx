import * as React from 'react'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import * as Form from 'react-bootstrap/lib/Form'
import * as FormGroup from 'react-bootstrap/lib/FormGroup'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'

import CatalogueCategoryTiles from './catalogue-category-tiles'
import CatalogueCategoryProductsTiles from './catalogue-product-tiles'

interface CatalogueProps {

}

@observer
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

                            <CatalogueCategoryTiles 
                                onCategorySelected={ this.handleCategorySelected } 
                            /> 
                        </div>
                    : 
                        <div>
                            <p className='title'>Kategorie</p>
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
        this.searchTerm = e.target.value
    }

    @action handleCategorySelected = (id) => {
        this.selectedCategory = id
    }

    handleProductSelected = (idx) => {
        console.log('product ', idx, ' selected')
    }

    @action handleCategoryBack = () => {
        this.selectedCategory = -1
    }
  
}