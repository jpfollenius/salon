import * as React from 'react'
import DevTools from 'mobx-react-devtools'
import { observable, action, autorun } from 'mobx'
import { observer, Provider } from 'mobx-react'
import * as Modal from 'react-bootstrap/lib/Modal'
import * as ProgressBar from 'react-bootstrap/lib/ProgressBar'
import Header from './header'
import LandingPage from './landing-page'
import { View, ViewState } from '../domain/view-state'
import { ProductStore } from '../domain/product-store'
import CashPoint from './cash-point/cash-point'

interface MainProps {
    viewState: ViewState
    productStore: ProductStore
}

@observer
export default class Main extends React.Component<MainProps, {}> {
    render() {   
        let mainContent

        if (!this.props.viewState.isAuthenticated) {
            mainContent = <LandingPage viewState={ this.props.viewState } />
        } else {
            mainContent = 
                <div>
                    <Header />
                    { this.renderCurrentView() }                               
                </div>
        }       

        const modal = this.props.viewState.modal;

        return (
            <Provider
                productStore={ this.props.productStore } 
                viewState={ this.props.viewState }
            >         
                { !this.props.viewState.isLoading
                    ?
                        <div> 
                            <Modal 
                                show={ this.props.viewState.modal.show }                        
                                onHide={ this.props.viewState.closeModal.bind(this.props.viewState) }
                            >   
                                <Modal.Header closeButton>
                                        <Modal.Title>{ modal.title }</Modal.Title>
                                </Modal.Header>                     
                                
                                { modal.content}                                            
                            </Modal>
                                        
                            { mainContent }
                            
                            <DevTools />
                        </div>
                    :
                        <div className='loading-screen'>
                            <h2 style={{textAlign:'center'}}>Wir laden Ihre Daten...</h2>
                            <ProgressBar now={100} striped active/>
                        </div>
                }                                      
                
            </Provider>
            )        
    }

    renderCurrentView() {
        const view = this.props.viewState.currentView
        switch (view) {
            case View.CashPoint:
                return <CashPoint />
            case View.Calendar:
                return <p>Kalender</p>                
            case View.Customers:
                return <p>Kunden</p>    
            case View.Inventory:
                return <p>Bestand</p>
            case View.Archive:
                return <p>Archiv</p>
            case View.Settings:
                return <p>Settings</p>            
        }
    }
}