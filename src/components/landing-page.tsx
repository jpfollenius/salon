import * as React from 'react'
import {observer} from 'mobx-react'
import {action, observable} from 'mobx'

import * as Navbar from 'react-bootstrap/lib/Navbar'
import * as Nav from 'react-bootstrap/lib/Nav'
import * as NavItem from 'react-bootstrap/lib/NavItem'
import * as Button from 'react-bootstrap/lib/Button'
import * as Jumbotron from 'react-bootstrap/lib/Jumbotron'
import * as Dropdown from 'react-bootstrap/lib/Dropdown'
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import * as SplitButton from 'react-bootstrap/lib/SplitButton'
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import * as Modal from 'react-bootstrap/lib/Modal'
import * as MenuItem from 'react-bootstrap/lib/MenuItem'
import * as Row from 'react-bootstrap/lib/Row'
import * as Table from 'react-bootstrap/lib/Table'
import * as Col from 'react-bootstrap/lib/Col'

import { ViewState } from '../domain/view-state'
import Login from './login'

interface LandingPageProps {
    viewState: ViewState
}

@observer
export default class LandingPage extends React.Component<LandingPageProps, void> {
    @observable modalVisible = false
    @observable loginVisible = false

    @action toggleModal = () => {
        this.modalVisible = !this.modalVisible
    }

    render() {
        return (
            <div>
                <Navbar inverse staticTop>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <span className='logo'>Salon</span>
                        </Navbar.Brand>                    
                    </Navbar.Header>

                    <Nav pullRight>
                        <NavItem>
                            <Button>Registrieren</Button>
                            <Button bsStyle='primary' onClick={this.handleLogin}>Anmelden</Button>
                        </NavItem>
                    </Nav> 
                </Navbar>

                <div className='bg'>
                    <div className='container'>

                        <ButtonToolbar>
                            <ButtonGroup>
                                <Dropdown id='customer-selection'>
                                    <Dropdown.Toggle>
                                        <Glyphicon glyph="user" />
                                        <span> Florian Faber</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <MenuItem>         
                                            <FormControl placeholder="Kunden suchen..." type="text" />
                                        </MenuItem>
                                           <MenuItem divider />
                                        <MenuItem eventKey="1">Hans Müller</MenuItem>
                                        <MenuItem eventKey="2">Peter Neururer</MenuItem>
                                        <MenuItem divider />
                                        <MenuItem>Laufkunde</MenuItem>
                                        <MenuItem>Laufkunde Mann</MenuItem>
                                        <MenuItem>Laufkunde Frau</MenuItem>
                                        <MenuItem>Laufkunde Kind</MenuItem>
                                           <MenuItem divider />
                                        
                                        <MenuItem>
                                            <Button bsStyle="primary">Neuer Kunde</Button>
                                        </MenuItem>
                                    </Dropdown.Menu>
                                </Dropdown>
                                
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button active>Tag</Button>
                                <Button>Woche</Button>
                               
                            </ButtonGroup>
                            <ButtonGroup className="pull-right">
                                <SplitButton pullRight onClick={ this.toggleModal } title="Neuer Termin">
                                    <MenuItem>Neuer Kundentermin</MenuItem>
                                    <MenuItem>Neuer interner Termin</MenuItem>
                                    <MenuItem>Neue Abwesenheit</MenuItem>
                                </SplitButton>
                            </ButtonGroup>
                        </ButtonToolbar>

                        <Modal show={this.modalVisible} onHide={ this.toggleModal }>

                            <Modal.Header closeButton>
                                <Modal.Title>Kassieren</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>Bar</td>
                                            <td><FormControl type="text" /></td>
                                        </tr>
                                        <tr>
                                            <td>EC</td>
                                            <td><FormControl type="text" /></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Modal.Body>
                        </Modal>
                            
                        <Jumbotron className='jumbotron'>
                            <h2>Platzhalter für Landing Page</h2>
                           {/* <p>Untertitel</p>
                            
                             <Row className="show-grid">
                                <Col xs={6} md={4}>
                                    <h4>Kasse</h4>
                                    <p>... </p>                                
                                </Col>
                                <Col xs={6} md={4}><h4>Kalender</h4></Col>
                                <Col xsHidden md={4}><h4>Kundenverwaltung</h4></Col>
                             </Row>                */}            
                        </Jumbotron>                        
                    </div>
                </div>
            </div>
        )                   
    }

    @action handleLogin = () => {
        this.props.viewState.showModal('Anmelden', <Login onSubmit={ this.props.viewState.closeModal.bind(this.props.viewState) } />)
    }
}