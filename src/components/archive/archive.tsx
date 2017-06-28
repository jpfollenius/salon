import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import * as Nav from 'react-bootstrap/lib/Nav'
import * as NavItem from 'react-bootstrap/lib/NavItem'

import ReceiptArchive from './receipt-archive'
import { Toolbar } from '../shared/ui'

enum ArchivePage {
  Receipts,
  DailyStatements,  
}

interface ArchiveProps {

}

@observer
export default class Archive extends React.Component<ArchiveProps, {}> {
  @observable currentPage: ArchivePage = ArchivePage.Receipts

  @action handlePageSelect = (page) => {
    this.currentPage = page
  }

  render() {
    const navigation = (
      <Nav bsStyle="pills" activeKey={this.currentPage} onSelect={this.handlePageSelect}>
        <NavItem eventKey={ArchivePage.Receipts}>Belege</NavItem>
        <NavItem eventKey={ArchivePage.DailyStatements}>Tagesabschlüsse</NavItem>                        
      </Nav>
    )

    switch (this.currentPage) {
      case ArchivePage.Receipts:
        return <ReceiptArchive navigation={navigation}/>        
      case ArchivePage.DailyStatements:
        return <div />                
    }    
  }
}