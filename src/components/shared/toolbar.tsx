import * as React from 'react'

const styles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px',
    borderBottom: '1px solid lightgray',
}

interface ToolbarProps {
        
}

export default class Toolbar extends React.Component<ToolbarProps, {}> {
    render() {
        return (
            <div style={styles}>
                {this.props.children}
            </div>
        )
    }
}