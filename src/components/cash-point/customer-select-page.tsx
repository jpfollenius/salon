import * as React from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import * as FormControl from 'react-bootstrap/lib/FormControl'

import CustomerSelection from '../customers/customer-selection'
import CustomerSuggestions from '../customers/customer-suggestions'
import { Toolbar, Button, Icon } from '../shared/ui'
import commonStyles from '../../styles'

const styles = {
  container: {
    marginTop: 40, 
    display: 'flex', 
    flexDirection: 'column'
  },
  toolbar: {
    ...commonStyles.cardToolbar,
    padding: '0 10px',
  },
  searchEdit: {
    marginRight: 20,
  }
}

interface CustomerSelectPageProps {
  onCustomerSelect: (customer) => void
}

@observer
export default class CustomerSelectPage extends React.Component<CustomerSelectPageProps, {}> {
  @observable searchText: string = ''

  @action handleSearchTextChange = (e) => {
    this.searchText = e.target.value
  }

  render() {
    let customerList

    if (this.searchText === '') {
      customerList = (
        <CustomerSuggestions
          onCustomerSelect={this.props.onCustomerSelect}
        />
      )      
    } else {
      customerList = (
        <CustomerSelection
          searchText={this.searchText}
          onCustomerSelect={this.props.onCustomerSelect}
        />
      )
    }

    return (
      <div style={styles.container}>
        <Toolbar style={styles.toolbar}>
          <FormControl style={styles.searchEdit} type='text' placeholder='Kunde suchen...' value={this.searchText} onChange={this.handleSearchTextChange} />          
          <Button primary><Icon icon="plus" /> Neuer Kunde</Button>
        </Toolbar>
        {customerList}
      </div>
    )
  }
}
