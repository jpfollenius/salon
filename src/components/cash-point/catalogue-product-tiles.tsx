import * as React from 'react'
import { observer } from 'mobx-react'

import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'

import CatalogueTile from './catalogue-tile'

const products = [
    'Schnitt',
    'Schnitt + Föhnen',
    'Schnitt + Waschen',
    'Schnitt + Waschen + Föhnen',
]

const productPrices = [
    12,
    16,
    16,
    20,
]

interface CatalogueCategoryProductsTilesProps {
    category: number
    onNavigateBack
    onProductSelected
}

@observer
export default class CatalogueCategoryProductsTiles extends React.Component<CatalogueCategoryProductsTilesProps, {}> {    
    render() {
            
        let tiles = products.map((product, idx) => {
            return (
                <CatalogueTile
                    key={idx}
                    id={idx}
                    bgColor='#2c3e50'
                    textColor='white'
                    text={ 
                        <div>
                            <p className='catalogue-text'>{ product }</p> 
                            <p className='catalogue-price'>{ productPrices[idx] + ' €' }</p>
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
                text={ <Glyphicon style={{fontSize: '24px'}} glyph='arrow-left' /> }
                onClick={ this.handleBackClick }                  

            />

        tiles = [backTile, ...tiles]
         
        return (                       
            <div className='catalogue-tile-layout'>
                { ...tiles }
            </div>
        )
    }

    handleProductClick = (idx) => {
        this.props.onProductSelected(idx)
    }

    handleBackClick = (idx) => {
        this.props.onNavigateBack()
    }
}
