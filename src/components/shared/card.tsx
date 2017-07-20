import * as React from 'react'

const style = {
  padding: '20px',
  border: '1px solid rgba(54, 64, 74, 0.05)',
  borderRadius: '5px',  
  backgroundClip: 'padding-box',
  backgroundColor: 'white'
}

interface CardProps {  
  style?
  onClick?
  className?: string
}

export default class Card extends React.Component<CardProps, {}> {
  render() {
    return (
      <div className={this.props.className} style={{...style, ...this.props.style}} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    )
  }
}