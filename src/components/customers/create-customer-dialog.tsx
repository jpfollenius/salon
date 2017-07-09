import * as React from 'react'
import { inject, observer } from 'mobx-react'
import * as Modal from 'react-bootstrap/lib/Modal'

import CreateCustomerForm from './create-customer-form'
import { Buttons, Button } from '../shared/ui'
import { Customer, CustomerStore } from '../../domain/customer-store'

interface CreateCustomerDialogProps {
  onSubmit
  onCancel
  customerStore?: CustomerStore
}

@inject('customerStore') @observer
export default class CreateCustomerDialog extends React.Component<CreateCustomerDialogProps, {}> {
  newCustomer: Customer = new Customer(this.props.customerStore)

  handleSubmit = () => {
    this.props.onSubmit(this.newCustomer)
  }

  render() {
    return (
      <div>
        <Modal.Body>
          <CreateCustomerForm 
            customer={this.newCustomer}
          />
        </Modal.Body>
        <Modal.Footer>
          <Buttons rightAligned>
            <Button onClick={this.props.onCancel}>Abbrechen</Button>
            <Button success onClick={this.handleSubmit}>Kunde anlegen</Button>
          </Buttons>

        </Modal.Footer>


      </div>
    )
  }
}