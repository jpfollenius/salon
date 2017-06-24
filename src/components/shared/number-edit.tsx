import * as React from 'react'
import * as FormControl from 'react-bootstrap/lib/FormControl'

interface NumberEditProps {
    value: number
    onChange
    style?: Object
}

export default class NumberEdit extends React.Component<NumberEditProps, {}> {
    render() {
        return (
            <FormControl
                input='number'                
                style={this.props.style}
                value={this.props.value}
                onChange={this.props.onChange}
            />
        )
    }
}