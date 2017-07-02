import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import * as ControlLabel from 'react-bootstrap/lib/ControlLabel'
import * as Form from 'react-bootstrap/lib/Form'
import * as FormGroup from 'react-bootstrap/lib/FormGroup'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'

import { Customer, Gender } from '../../domain/customer-store'
import { Button } from '../shared/ui'

interface CreateCustomerFormProps {
  customer: Customer
}

@observer
export default class CreateCustomerForm extends React.Component<CreateCustomerFormProps, {}> {  
  @observable birthDate: string = undefined

  @action handleFirstNameChange = (e) => {
    this.props.customer.firstName = e.target.value
  }

  @action handleLastNameChange = (e) => {
    this.props.customer.lastName = e.target.value
  }

  @action handleSupplementChange = (e) => {
    this.props.customer.supplement = e.target.value
  }

  @action handlePhoneNumberChange = (e) => {
    this.props.customer.phoneNumber = e.target.value
  }

  @action handleEmailChange = (e) => {
    this.props.customer.email = e.target.value
  }

  @action handleCommentChange = (e) => {
    this.props.customer.comment = e.target.value
  }

  @action handleBirthdateChange = (e) => {
    this.birthDate = e.target.value
    const timestamp = Date.parse(this.birthDate)
    if (!isNaN(timestamp))
      this.props.customer.birthDate = new Date(timestamp)
  }

  @action setGender(gender: Gender) {
    this.props.customer.gender = gender
  }

  render() {
    const customer = this.props.customer

    return (
      <Form>
        <FormGroup controlId="formGender">
          <ButtonGroup>
            <Button active={customer.gender === Gender.Male} onClick={() => this.setGender(Gender.Male)}>Mann</Button>
            <Button active={customer.gender === Gender.Female} onClick={() => this.setGender(Gender.Female)}>Frau</Button>
            <Button active={customer.gender === Gender.Child} onClick={() => this.setGender(Gender.Child)}>Kind</Button>
          </ButtonGroup>
        </FormGroup>

        <FormGroup controlId="formFirstName">
          <ControlLabel>Vorname</ControlLabel>
          <FormControl type="text" value={customer.firstName} onChange={this.handleFirstNameChange} />
        </FormGroup>

        <FormGroup controlId="formLastName">
          <ControlLabel>Nachname</ControlLabel>
          <FormControl type="text" value={customer.lastName} onChange={this.handleLastNameChange} />
        </FormGroup>

        <FormGroup controlId="formBirthDate">
          <ControlLabel>Geburtsdatum</ControlLabel>
          <FormControl type="date" value={this.birthDate} onChange={this.handleBirthdateChange} />
        </FormGroup>
        
                
        <FormGroup controlId="formPhoneNumber">
          <ControlLabel>Telefonnummer</ControlLabel>
          <FormControl type="text" value={customer.phoneNumber} onChange={this.handlePhoneNumberChange} />
        </FormGroup>

        <FormGroup controlId="formEmail">
          <ControlLabel>Email</ControlLabel>
          <FormControl type="email" value={customer.email} onChange={this.handleEmailChange} />
        </FormGroup>

        <FormGroup controlId="formComments">
          <ControlLabel>Bemerkungen</ControlLabel>
          <FormControl componentClass="textarea" value={customer.comment} onChange={this.handleCommentChange} />
        </FormGroup>
        
        
        



      </Form>
    )
  }
}
