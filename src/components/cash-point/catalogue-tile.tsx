import * as React from 'react'
import { Icon } from '../shared/ui'

const styles = {
    favoriteIcon: {
        marginTop: '5px' 
    }
}

interface CatalogueTileProps {    
    id: number
    text: JSX.Element
    textColor: string
    bgColor: string    
    onClick?
    showFavorite?: boolean
}

export default class CatalogueTile extends React.Component<CatalogueTileProps, {}> {
    render() { 
        return (            
            <div 
                className='catalogue-tile' 
                style={{backgroundColor: this.props.bgColor, color: this.props.textColor}}
                onClick={ () => this.props.onClick(this.props.id) } 
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