import * as React from 'react'

import Icon from './icon'

const styles = {
  layout: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  spinner: {    
    margin: 'auto',
    left: '50%',    
  },  
}

interface SpinnerProps {

}

export default class Spinner extends React.Component<SpinnerProps, {}> {
  render() {
    return (      
      <Icon fontawesome icon="circle-o-notch" spinning style={styles.spinner} />
    )
  }
}