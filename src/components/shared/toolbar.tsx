import * as React from 'react'

const style = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px',
    borderBottom: '1px solid lightgray',
}

interface ToolbarProps {
    style?        
}

export default class Toolbar extends React.Component<ToolbarProps, {}> {
    render() {
        return (
            <div style={{...style, ...this.props.style}}>
                {this.props.children}
            </div>
        )
    }
}