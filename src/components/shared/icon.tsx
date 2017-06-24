import * as React from 'react'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'

interface IconProps {
    icon: string
    style?: Object
    fontawesome?: boolean
}

export default class Icon extends React.Component<IconProps, {}> {
    render() { 
        return this.props.fontawesome
            ? <i className={"fa fa-" + this.props.icon} style={this.props.style} aria-hidden="true"></i>
            : <Glyphicon style={this.props.style} glyph={this.props.icon} />
    }
}