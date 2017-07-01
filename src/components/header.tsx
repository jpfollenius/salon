import * as React from 'react'
import { inject, observer } from 'mobx-react'

import * as Navbar from 'react-bootstrap/lib/Navbar'
import * as Nav from 'react-bootstrap/lib/Nav'
import * as NavItem from 'react-bootstrap/lib/NavItem'
import * as NavDropdown from 'react-bootstrap/lib/NavDropdown'
import * as MenuItem from 'react-bootstrap/lib/MenuItem'

import { View, ViewState } from '../domain/view-state'
import { Icon } from './shared/ui'

enum LogoMenu {
    Settings,
    Help,
    Logout,
}

const styles = {
    headerIcon: {
        fontSize: '16px',
        marginRight: '8px',
    },
    logoNav: {
        marginRight: '20px',
    }
}

interface HeaderProps {
    viewState?: ViewState
}

@inject('viewState') @observer
export default class Header extends React.Component<HeaderProps, {}> {
    render() {
        return (
            <Navbar inverse staticTop className='full-width'>                        
                <Nav style={styles.logoNav}>
                    <NavDropdown onSelect={ this.handleMenuSelect } title={ <span className='logo'>Salon</span> } id='navbar-logo-dropdown'>
                        <MenuItem eventKey={LogoMenu.Settings}>Einstellungen</MenuItem>                                            
                        <MenuItem divider />
                        <MenuItem eventKey={LogoMenu.Help}>Hilfe</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={LogoMenu.Logout}>Abmelden</MenuItem>
                    </NavDropdown>

                </Nav>

                <Nav activeKey={ this.props.viewState.currentView } onSelect={ this.handleViewSelect }>
                    <NavItem eventKey={ View.CashPoint }><Icon icon='shopping-cart' style={styles.headerIcon} /><span className='header-text'>Kasse</span></NavItem>
                    <NavItem eventKey={ View.Calendar }><Icon icon='calendar' style={styles.headerIcon} /><span className='header-text'>Kalender</span></NavItem>                    
                    <NavItem eventKey={ View.Customers }><Icon icon='user' style={styles.headerIcon} /><span className='header-text'>Kunden</span></NavItem>
                    <NavItem eventKey={ View.Inventory }><Icon fontawesome icon='cubes' style={styles.headerIcon} /><span className='header-text'>Bestand</span></NavItem>
                    <NavItem eventKey={ View.Archive }><Icon fontawesome icon='book' style={styles.headerIcon} /><span className='header-text'>Archiv</span></NavItem>
                </Nav>                
            </Navbar>            
        )
    }

    handleViewSelect = view => {
        this.props.viewState.setCurrentView(view)                
    }

    handleMenuSelect = key => {
        switch (key) {
            case LogoMenu.Settings:   
                this.props.viewState.setCurrentView(View.Settings)             
                break
            case LogoMenu.Logout:
                this.props.viewState.logout()
                break            
        }
    }
}