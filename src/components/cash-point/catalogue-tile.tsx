import * as React from 'react'
import { Icon } from '../shared/ui'
import { CatalogueCategory } from '../../domain/catalogue-store'
import { Product } from '../../domain/product-store'

const styles = {
    favoriteIcon: {
      //marginTop: '5px' 
    }
}

interface CatalogueTileProps {        
    text: JSX.Element
    textColor: string
    bgColor: string    
    onClick?
    showFavorite?: boolean
}

export class CatalogueTile extends React.Component<CatalogueTileProps, {}> {
    render() { 
        return (            
            <div 
                className='catalogue-tile' 
                style={{padding: 5, backgroundColor: this.props.bgColor, color: this.props.textColor}}
                onClick={ this.props.onClick } 
            >
                { this.props.showFavorite &&
                    <Icon style={styles.favoriteIcon} icon='star' />
                }
                <div className='catalogue-tile-content'>               
                    { this.props.text }
                </div>
            </div>
        )

    }
}

interface CatalogueCategoryTileProps {
    category: CatalogueCategory
    onClick?
}

export class CatalogueCategoryTile extends React.Component<CatalogueCategoryTileProps, {}> {
    render() {
        return <CatalogueTile
                    text={<span>{this.props.category.name}</span>}    
                    bgColor={this.props.category.backgroundColor}
                    textColor={this.props.category.foregroundColor}
                    onClick={ () => this.props.onClick(this.props.category) }
                />
    }
}

interface CatalogueBackTileProps {    
    onClick
}

export class CatalogueBackTile extends React.Component<CatalogueBackTileProps, {}> {
    render() {
        return <CatalogueTile
                    text={ <Icon style={{fontSize: '24px'}} icon='arrow-left' /> }    
                    bgColor='#2ecc71'
                    textColor='white'
                    onClick={ this.props.onClick }
                />
    }
}

interface CatalogueProductTileProps {    
    product: Product
    onClick
    showFavorite?: boolean
}

export class CatalogueProductTile extends React.Component<CatalogueProductTileProps, {}> {
    render() {
        return <CatalogueTile
                    showFavorite={this.props.showFavorite}
                    text={ 
                        <div>                            
                            <p className='catalogue-text'>{ this.props.product.name }</p> 
                            <p className='catalogue-price'>{ this.props.product.price + ' €' }</p>
                        </div> 
                    }    
                    bgColor='#2c3e50'
                    textColor='white'
                    onClick={ () => this.props.onClick(this.props.product) }
                />
    }
}

