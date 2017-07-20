import * as React from 'react'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'

interface IconProps {
    icon: string
    style?: Object
    fontawesome?: boolean
    spinning?: boolean
    onClick?
    larger?
}

export default class Icon extends React.Component<IconProps, {}> {
    handleClick = (e) => {    
        if (this.props.onClick)
            this.props.onClick(e)
    }

    render() { 
        let faClassName = 'fa fa-' + this.props.icon
        if (this.props.spinning) {
            faClassName = faClassName + ' fa-spin'
        }

        if (this.props.larger) {
            faClassName = faClassName + ' fa-lg'
        }

        return this.props.fontawesome
            ? <i className={faClassName} style={this.props.style} aria-hidden="true" onClick={this.handleClick}></i>
            : <Glyphicon style={this.props.style} glyph={this.props.icon} onClick={this.handleClick} />
    }
}