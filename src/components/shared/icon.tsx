import * as React from 'react'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'

interface IconProps {
    icon: string
    style?: Object
    fontawesome?: boolean
    spinning?: boolean
    onClick?
}

export default class Icon extends React.Component<IconProps, {}> {
    handleClick = (e) => {
        console.log(e)
        e.stopPropagation()
        console.log(this.props.onClick)
        if (this.props.onClick)
            this.props.onClick(e)
    }

    render() { 
        let faClassName = 'fa fa-' + this.props.icon
        if (this.props.spinning) {
            faClassName = faClassName + ' fa-spin'
        }

        return this.props.fontawesome
            ? <i className={faClassName} style={this.props.style} aria-hidden="true" onClick={this.handleClick}></i>
            : <Glyphicon style={this.props.style} glyph={this.props.icon} onClick={this.handleClick} />
    }
}