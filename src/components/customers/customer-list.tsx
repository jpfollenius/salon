import * as React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import * as FormControl from 'react-bootstrap/lib/FormControl'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { Card, Toolbar, Button, Buttons, Icon } from '../shared/ui'
import commonStyles from '../../styles'

const styles = {
  layout: {
    display: 'flex',
  },
  searchBox: {
    maxWidth: '400px',
  },
  customerDetails: {
    width: '400px',
    flexShrink: 0,
    marginLeft: '20px',
  },
  comment: {
    marginTop: '20px',
  },
  contactInfo: {
    margin: '20px 0'
  },
  date: {
    color: '#98a6ad'
  }
}

interface CustomerListProps {

}

const customers = [
  {
    id: 0,
    firstName: 'Jan-Philipp',
    lastName: 'Follenius'
  },
  {
    id: 1,
    firstName: 'Max',
    lastName: 'Mustermann'
  },
  {
    id: 2,
    firstName: 'Jan-Philipp',
    lastName: 'Follenius'
  },
  {
    id: 3,
    firstName: 'Max',
    lastName: 'Mustermann'
  },
  {
    id: 4,
    firstName: 'Jan-Philipp',
    lastName: 'Follenius'
  },
  {
    id: 5,
    firstName: 'Max',
    lastName: 'Mustermann'
  },
  {
    id: 6,
    firstName: 'Jan-Philipp',
    lastName: 'Follenius'
  },
  {
    id: 7,
    firstName: 'Max',
    lastName: 'Mustermann'
  },
]

export default class CustomerList extends React.Component<CustomerListProps, {}> {

  getIcon(cell, customer) {
    if (Math.random() < 0.5) {
      return <Icon style={{color: 'cornflowerblue', fontSize: '22px'}} fontawesome icon="male" />
    } else {
      return <Icon style={{color: 'darkmagenta', fontSize: '22px'}} fontawesome icon="female" />
    }
  }

  render() {
    const tableOptions = {
      noDataText: 'Noch keine Kunden vorhanden',      
    }

    const selectionOptions = {
      mode: 'radio',
      hideSelectColumn: true,
      clickToSelect: true,
      bgColor: 'lightgray'
    }

    return (
      <div style={{...commonStyles.contentContainer, ...styles.layout}}>
        <Card>
          <Toolbar style={commonStyles.cardToolbar}>
            <FormControl style={styles.searchBox} type='text' placeholder='Kunde suchen...' />          
            <Button primary><Icon icon="plus" /> Neuer Kunde</Button>
          </Toolbar>

          <BootstrapTable 
            data={customers} 
            options={tableOptions}                  
            selectRow={selectionOptions}
            condensed       
            hover
            bordered={false}            
          >
            <TableHeaderColumn dataField='id' isKey hidden></TableHeaderColumn>
            <TableHeaderColumn dataFormat={this.getIcon} width={30}></TableHeaderColumn>
            <TableHeaderColumn dataField='lastName'>Name</TableHeaderColumn>
            <TableHeaderColumn dataField='firstName'>Vorname</TableHeaderColumn>            
            <TableHeaderColumn dataField='firstName'>Telefonnummer</TableHeaderColumn>            
            <TableHeaderColumn dataField='firstName'>Bemerkungen</TableHeaderColumn>            
            <TableHeaderColumn dataField='firstName'>Letzter Termin</TableHeaderColumn>            
            <TableHeaderColumn dataField='firstName'>Nächster Termin</TableHeaderColumn>                                         
          </BootstrapTable>             
        </Card>
        <Card style={styles.customerDetails}>
          <h2>Follenius, Jan-Philipp</h2>
          <div style={styles.comment}>Bemerkungen zu diesem Kunden, die sich über mehrere Zeilen erstrecken kann</div>
          <div style={styles.contactInfo}>
            <p><Icon icon="phone" /> 017620528937</p>
            <p><Icon icon="envelope" /> jpfollenius@gmail.com</p>
          </div>
          <Buttons>
            <Button>Zur Kasse</Button>
            <Button>Neuer Termin</Button>
          </Buttons>
          <hr />

          <div className="timeline-2">
            <div className="time-item">
              <div className="item-info">
                <small style={styles.date}>01.12.2016</small>
                <p>Haare schneiden, Föhnen</p>
              </div>
            </div>

            <div className="time-item">
              <div className="item-info">
                <small style={styles.date}>01.12.2016</small>
                <p>Haare schneiden</p>
              </div>
            </div>

            <div className="time-item">
              <div className="item-info">
                <small style={styles.date}>01.12.2016</small>
                <p>Haare schneiden, Föhnen</p>
              </div>
            </div>
          </div>

        </Card>
      </div>
    )
  }
}