import * as React from 'react'
import { observer } from 'mobx-react'
import * as Table from 'react-bootstrap/lib/Table'

import { Buttons, Button } from '../shared/ui'
import { Receipt } from '../../domain/receipt-store'
import { Card, CardTitle, Icon } from '../shared/ui'
import commonStyles from '../../styles'
import { formatPrice } from '../../utils/utils'

const styles = {
  layout: {
    height: '100%',
  },
  titleLayout: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentDetails: {
    margin: '40px 0',
  },
}

interface ReceiptDetailsProps {
  receipt: Receipt
  onClose: () => void
}

export default class ReceiptDetails extends React.Component<ReceiptDetailsProps, {}> {
  render() { 
    const receipt = this.props.receipt

    return (
      <Card style={styles.layout}>
        <div style={styles.titleLayout}>
          <h3>Beleg {receipt.number}</h3>
          <Icon icon='times' larger fontawesome onClick={this.props.onClose} />
        </div>
        
        <Table bordered>
          <thead>
            <tr>  
              <th />
              <th>Anzahl</th>
              <th>Einzelpreis</th>
              <th>Preis</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map(receiptItem => (
              <tr>
                <td>{receiptItem.name}</td>
                <td style={{width: 100}}>{receiptItem.quantity}</td>
                <td style={{width: 100}}>{receiptItem.price}</td>
                <td style={{width: 100}}>{formatPrice(receiptItem.totalPrice)} €</td>
              </tr>
            ))}

          </tbody>        
        </Table>
       
        <div style={styles.paymentDetails}>
          <h4>Bezahlung</h4>

          <Table bordered>
            <tbody>
              <tr>
                <td>Summe</td>
                <td>{formatPrice(receipt.totalPrice)} €</td>
              </tr>
              <tr>
                <td>Bar</td>
                <td></td>
              </tr>      
              <tr>
                <td>EC</td>
                <td></td>
              </tr>                       

            </tbody>
          </Table>
        </div>
        
        <Buttons>
          <Button danger>Storno</Button>
          <Button>Bondruck</Button>
        </Buttons>
      </Card>
    )
  }
}