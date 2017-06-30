import * as React from 'react'

const style = {
  padding: '20px',
  border: '1px solid rgba(54, 64, 74, 0.05)',
  borderRadius: '5px',
  marginBottom: '20px',
  backgroundClip: 'padding-box',
  backgroundColor: 'white',
}

interface CardProps {
  style?
}

export default class Card extends React.Component<CardProps, {}> {
  render() {
    return (
      <div style={{...style, ...this.props.style}}>
        {this.props.children}
      </div>
    )
  }
}