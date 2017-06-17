import * as React from 'react'
import { inject, observer } from 'mobx-react'

import * as Glyphicon from 'react-bootstrap/lib/Glyphicon'
import * as Navbar from 'react-bootstrap/lib/Navbar'
import * as Nav from 'react-bootstrap/lib/Nav'
import * as NavItem from 'react-bootstrap/lib/NavItem'
import * as NavDropdown from 'react-bootstrap/lib/NavDropdown'
import * as MenuItem from 'react-bootstrap/lib/MenuItem'

import { View, ViewState } from '../domain/view-state'

interface HeaderProps {
    viewState?: ViewState
}

enum LogoMenu {
    Settings,
    Help,
    Logout,
}

@inject('viewState') @observer
export default class Header extends React.Component<HeaderProps, {}> {
    render() {
        return (
            <Navbar inverse staticTop className='full-width'>                        
                <Nav>
                    <NavDropdown onSelect={ this.handleMenuSelect } title={ <span className='logo'>Salon</span> } id='navbar-logo-dropdown'>
                        <MenuItem eventKey={LogoMenu.Settings}>Einstellungen</MenuItem>                                            
                        <MenuItem divider />
                        <MenuItem eventKey={LogoMenu.Help}>Hilfe</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey={LogoMenu.Logout}>Abmelden</MenuItem>
                    </NavDropdown>

                </Nav>

                <Nav activeKey={ this.props.viewState.currentView } onSelect={ this.handleViewSelect }>
                    <NavItem eventKey={ View.CashPoint }><Glyphicon className="header-icon" glyph="shopping-cart" /><span className='header-text'>Kasse</span></NavItem>
                    <NavItem eventKey={ View.Calendar }><Glyphicon className="header-icon" glyph="calendar" /><span className='header-text'>Kalender</span></NavItem>                    
                    <NavItem eventKey={ View.Customers }><Glyphicon className="header-icon" glyph="user" /><span className='header-text'>Kunden</span></NavItem>
                    <NavItem eventKey={ View.Inventory }><i className="header-icon fa fa-cubes" aria-hidden="true"></i><span className='header-text'>Bestand</span></NavItem>
                    <NavItem eventKey={ View.Archive }><i className="header-icon fa fa-book" aria-hidden="true"></i><span className='header-text'>Archiv</span></NavItem>
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
                break
            case LogoMenu.Logout:
                this.props.viewState.logout()
                break            
        }
    }
}