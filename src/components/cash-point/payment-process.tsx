import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { observable, action, computed } from 'mobx'
//import Steps from 'react-steps'
import * as FormControl from 'react-bootstrap/lib/FormControl'

import CustomerSelection from '../customers/customer-selection'
import Catalogue from './catalogue'
import ReceiptView from './receipt-view'
import PaymentDetails from './payment-details'
import CustomerSelectPage from './customer-select-page'
import { Receipt } from '../../domain/receipt-store'
import { Button, Icon, Card, Toolbar } from '../shared/ui'
import commonStyles from '../../styles'
import Steps from '../shared/steps'

enum PaymentProcessStep {
  CustomerSelection,
  ReceiptCreation,  
  Payment,
}

function ReceiptEditingPage({ receipt }) {
  const styles = {
    container: {
      display: 'flex',  
      margin: '40px 0',          
    },
    catalogue: {                  
      width: '462px',  
      marginRight: '60px',         
    },    
    receipt: {        
      flexGrow: 1,
      flexShrink: 1,                   
    },
  }

  return (
    <div style={styles.container}>            
      <div style={styles.catalogue}>
          <Catalogue 
              onProductSelected={ (product) => { receipt.addProduct(product) } }
          />
      </div>                      
      
      <div style={styles.receipt}>
          <ReceiptView               
              receipt={ receipt }               
          />
      </div>
  </div>      
  )
}

function PaymentPage({ receipt }) {
  const styles = {
    container: {
      display: 'flex',  
      margin: '40px 0',          
    },
    receipt: {        
      flexGrow: 1,
      flexShrink: 1,       
      marginRight: 80,            
    },
    paymentDetails: {
      width: '38%',
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.receipt}>
        <ReceiptView
          receipt={receipt}
        />
      </div>

      <PaymentDetails 
        style={styles.paymentDetails}
        amount={ receipt.totalPrice }
        onBack={ () => {} }
        onSubmit={ () => {} }                        
      />     
    </div>

  )
}

const headerStyles = {
  layout: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonIcon: {
    marginLeft: 5,
  },
  icon: {
    fontSize: 26,
    marginRight: 10,
  }
}

interface PaymentProcessHeaderProps {
  step: PaymentProcessStep 
  onNextClick: () => void
  onGotoStep: (PaymentProcessStep) => void
}

@observer
class PaymentProcessHeader extends React.Component<PaymentProcessHeaderProps, {}> {
  getStepIndex(): number {
    switch (this.props.step) {
      case PaymentProcessStep.CustomerSelection:
        return 0
      case PaymentProcessStep.ReceiptCreation:
        return 1
      case PaymentProcessStep.Payment:
        return 2
    }
  }
  @action handleStepClick = (index) => {
    if ((index < this.getStepIndex()) && this.props.onGotoStep)
      this.props.onGotoStep(index)
  }

  render() {
    const isPaying = this.props.step === PaymentProcessStep.Payment
    const showSuccessButton = isPaying
    const buttonText = isPaying ? 'Bezahlt' : 'Weiter'
    
    return (
      <div style={headerStyles.layout}>
        <Steps 
          steps={['Kundenauswahl', 'Beleg erstellen', 'Kassieren']} 
          currentStep={this.getStepIndex()}
          onStepClick={this.handleStepClick}
        />

        { this.props.step !== PaymentProcessStep.CustomerSelection &&
          <Button 
            success={showSuccessButton} 
            primary={!showSuccessButton} 
            onClick={this.props.onNextClick}
          >
            {buttonText} <Icon style={headerStyles.buttonIcon} fontawesome icon='chevron-right' />
          </Button>
        }
      </div>
    )
  }
}

interface PaymentProcessProps {
  receipt: Receipt  
}

function CustomerCard({icon, iconText, title, subtitle, onClick}) {
  const style = {
    borderBottom: '1px solid lightgray',
    minHeight: 64,   
    display: 'flex',
    alignItems: 'center',
    margin: 10,
    paddingLeft: 10,

  }

  return (
    <div style={style} onClick={onClick}>      
      <Icon style={headerStyles.icon} fontawesome icon={icon} />
      <p style={{marginRight: 20}}>{iconText}</p>
      <div>
        <big>{title}</big><br />
        <small>{subtitle}</small>
      </div>      
    </div>
  )
}

@observer
export default class PaymentProcess extends React.Component<PaymentProcessProps, {}> {
  @observable step: PaymentProcessStep = PaymentProcessStep.CustomerSelection
  @observable searchText: string = ''

  @action handleCustomerSelect = (customer) => {    
    this.props.receipt.customer = customer   
    this.step = PaymentProcessStep.ReceiptCreation             
  }

  @action handleNextClick = () => {
    if (this.step === PaymentProcessStep.Payment) {    
      this.props.receipt.save()      
      this.step = PaymentProcessStep.CustomerSelection
    } else {
      this.step++
    }    
  }

  @action handleGotoStep = (step) => {
    this.step = step
  }

  @action handleSearchTextChange = (e) => {
    this.searchText = e.target.value
  }

  render() {
    let content
    let customerList

    switch (this.step) {
      case PaymentProcessStep.CustomerSelection:        
        content = (
          <CustomerSelectPage
            onCustomerSelect={this.handleCustomerSelect}
          />
        )
        break
      case PaymentProcessStep.ReceiptCreation:
        content = <ReceiptEditingPage
                    receipt={this.props.receipt}
                  />
        break
      case PaymentProcessStep.Payment:
        content = <PaymentPage receipt={this.props.receipt} />
        break
    }

    return (
      <div>
        <PaymentProcessHeader 
          step={this.step} 
          onNextClick={this.handleNextClick}
          onGotoStep={this.handleGotoStep}
        />        
        {content}
      </div>
    )
  }
}