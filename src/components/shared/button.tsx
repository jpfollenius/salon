import * as React from 'react'
import * as BoostrapButton from 'react-bootstrap/lib/Button'

const style = {
    fontSize: '16px'    
}

interface PrimaryButtonProps {
    primary?: boolean
    danger?: boolean
    success?: boolean
    disabled?: boolean
    onClick?
    style?: Object
    active?: boolean
}

export default class Button extends React.Component<PrimaryButtonProps, {}> {
    render() {
        let bsStyle = 'default'

        if (this.props.primary) {
            bsStyle = 'primary'
        } else if (this.props.danger) {
            bsStyle = 'danger'
        } else if (this.props.success) {
            bsStyle = 'success'
        }
        
        return (
            <BoostrapButton 
                bsStyle={bsStyle} 
                disabled={this.props.disabled} 
                active={this.props.active}
                style={{...style, ...this.props.style}} 
                onClick={this.props.onClick}
            >
                {this.props.children}
            </BoostrapButton>

        )
    }
}