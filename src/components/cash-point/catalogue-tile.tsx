import * as React from 'react'

interface CatalogueTileProps {    
    id: number
    text: JSX.Element
    textColor: string
    bgColor: string    
    onClick?
}

export default class CatalogueTile extends React.Component<CatalogueTileProps, {}> {
    render() { 
        return (
            <div className='catalogue-tile' style={{backgroundColor: this.props.bgColor, color: this.props.textColor}} onClick={ () => this.props.onClick(this.props.id) }>
                { this.props.text }
            </div>
        )

    }
}