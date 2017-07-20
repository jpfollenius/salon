import * as React from 'react'

import { Gender } from '../../domain/customer-store'
import { Icon } from '../shared/ui'

interface GenderIconProps {
  gender: Gender
  color: string
}

export default function GenderIcon({ gender, color }) {
  const iconStyle = {
    color: color,
    fontSize: 32,    
  }

  switch (gender) {
    case Gender.Male:
      return <Icon style={iconStyle} icon='male' fontawesome />
    case Gender.Female:
      return <Icon style={iconStyle} icon='female' fontawesome />
    case Gender.Child:
      return <Icon style={iconStyle} icon='child' fontawesome />
  }  
}

