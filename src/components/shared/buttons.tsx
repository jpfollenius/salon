import * as React from 'react'
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'

const styles = {
    base: {        
        display: 'flex',        
        alignItems: 'center',
    },
    leftAligned: {
        justifyContent: 'flex-start',
    },
    rightAligned: {
        justifyContent: 'flex-end',
    },
    toolbar: {
        verticalAlign: 'middle',        
    }
}

interface ButtonsProps {
    rightAligned?: boolean
    style?: Object
}

export default class Buttons extends React.Component<ButtonsProps, {}> {
    render() {
        return (
            <div style={{...styles.base, ...this.props.style, ...this.props.rightAligned ? styles.rightAligned : styles.leftAligned}}>
                <ButtonToolbar style={styles.toolbar}>
                    {this.props.children}
                </ButtonToolbar>
            </div>

        )
    }
}