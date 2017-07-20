import * as React from 'react'

const style = {
  marginTop: -5,
  marginBottom: 20,
}

function CardTitle(props) {
  return <h3 style={style}>{props.children}</h3>
}

export default CardTitle