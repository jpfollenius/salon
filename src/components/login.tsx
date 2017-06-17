import * as React from 'react'
import { computed, observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import * as Form from 'react-bootstrap/lib/Form'
import * as FormGroup from 'react-bootstrap/lib/FormGroup'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as Button from 'react-bootstrap/lib/Button'
import * as Modal from 'react-bootstrap/lib/Modal'
import * as HelpBlock from 'react-bootstrap/lib/HelpBlock'

import { ViewState } from '../domain/view-state'
import agent from '../agent'

interface LoginProps {
    viewState?: ViewState    
    onSubmit
}

@inject('viewState') @observer
export default class Login extends React.Component<LoginProps, {}> {
    @observable email
    @observable password    
    @observable authenticationError       

    @computed get canSubmit() {
        return (this.email && this.password)
    }

    render() { 
        return (
            <Form onSubmit={ this.handleSubmit }>
                <Modal.Body>
                    <FormGroup controlId="formControlEmail" >
                        <FormControl type="text" placeholder="Email" value={ this.email } onChange={ this.handleEmailChange } />
                    </FormGroup>
                    <FormGroup controlId="formControlPassword">     
                        <FormControl type="password" placeholder="Passwort" value={ this.password } onChange={ this.handlePasswordChange } />               
                    </FormGroup>        
                    <FormGroup controlId="formControlAuthError" validationState='error'>                        
                        <HelpBlock>{ this.authenticationError }</HelpBlock>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='primary' disabled={!this.canSubmit} onClick={this.handleSubmit}>Anmelden</Button>
                </Modal.Footer>
            </Form>

        )
    }

    @action handleEmailChange = (e) => {
        this.email = e.target.value
    }

    @action handlePasswordChange = (e) => {
        this.password = e.target.value
    }

    @action setAuthenticationError(error) {
        this.authenticationError = error
    }

    handleSubmit = () => {
        agent.Auth.authenticate(this.email, this.password)
            .then(() => {                
                this.props.onSubmit()
            })
            .catch(reason => {                
                this.setAuthenticationError(reason)
            })                                                  
    }
}