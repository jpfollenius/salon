import * as React from 'react'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'

interface IconProps {
    icon: string
    style?: Object
    fontawesome?: boolean
    spinning?: boolean
}

export default class Icon extends React.Component<IconProps, {}> {
    render() { 
        let faClassName = 'fa fa-' + this.props.icon
        if (this.props.spinning) {
            faClassName = faClassName + ' fa-spin'
        }

        return this.props.fontawesome
            ? <i className={faClassName} style={this.props.style} aria-hidden="true"></i>
            : <Glyphicon style={this.props.style} glyph={this.props.icon} />
    }
}