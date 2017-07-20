import * as React from 'react'

import { Customer, Gender } from '../../domain/customer-store'
import { Icon } from '../shared/ui'
import GenderIcon from './gender-icon'

interface CustomerIconProps {
  customer: Customer
}

export default function CustomerIcon({ customer }) {
  const styles = {
    container: {
      position: 'relative',
      float: 'left',      
    },
    badge: {
      backgroundColor: '#337ab7',
      fontSize: 10,
      width: 16,
      height: 16,
      borderRadius: '50%',
      position: 'absolute',
      bottom: -6,
      right: -6,
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }
  }

  const icon = <GenderIcon color='#333' gender={customer.gender} />

  return (
    <span style={styles.container}>
      {icon}
    </span>
  )
}

