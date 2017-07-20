import * as React from 'react'
import { observer } from 'mobx-react'

import { Customer } from '../../domain/customer-store'
import { Card, Button, Buttons, Icon } from '../shared/ui'

const styles={
  layout: {
    height: '100%',
  },
  titleLayout: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  comment: {
    marginTop: '20px',
  },
  contactInfo: {
    margin: '20px 0'
  },
  contactInfoIcon: {
    marginRight: '10px',
  },
  timelineDate: {
    color: '#98a6ad'
  },
}

interface CustomerDetailsProps {
  customer: Customer
  onCustomerDelete?: () => void 
  onClose: () => void
}

@observer
export default class CustomerDetails extends React.Component<CustomerDetailsProps, {}> {
  handleDeleteClick = () => {
    this.props.customer.delete()

    if (this.props.onCustomerDelete)
      this.props.onCustomerDelete()    
  }

  render() {
    const { customer } = this.props

    return (        
      <Card style={styles.layout}>
        <div style={styles.titleLayout}>
          <h3>{customer.fullName}</h3>
          <Icon icon='times' larger fontawesome onClick={this.props.onClose} />
        </div>
        <div style={styles.comment}>{customer.comment}</div>
        
        <div style={styles.contactInfo}>
          { customer.birthDate &&
            <p><Icon style={styles.contactInfoIcon} fontawesome icon="birthday-cake" />{customer.birthDate.toString()}</p>
          }
          
          { customer.phoneNumber &&
            <p><Icon style={styles.contactInfoIcon} icon="phone" />{customer.phoneNumber}</p>
          }          

          { customer.email &&
            <p><Icon style={styles.contactInfoIcon} icon="envelope" />{customer.email}</p>              
          }              
        </div>

        <Buttons>
          <Button>Zur Kasse</Button>
          <Button>Neuer Termin</Button>
          <Button><Icon icon="pencil" /></Button>
          <Button danger onClick={this.handleDeleteClick}>Löschen</Button>
        </Buttons>
        <hr />

        <div className="timeline-2">
          <div className="time-item">
            <div className="item-info">
              <small style={styles.timelineDate}>01.12.2016</small>
              <p>Haare schneiden, Föhnen</p>
            </div>
          </div>

          <div className="time-item">
            <div className="item-info">
              <small style={styles.timelineDate}>01.12.2016</small>
              <p>Haare schneiden</p>
            </div>
          </div>

          <div className="time-item">
            <div className="item-info">
              <small style={styles.timelineDate}>01.12.2016</small>
              <p>Haare schneiden, Föhnen</p>
            </div>
          </div>
        </div>

      </Card>
    )
  }
}