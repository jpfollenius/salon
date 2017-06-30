import * as React from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import * as Nav from 'react-bootstrap/lib/Nav'
import * as NavItem from 'react-bootstrap/lib/NavItem'

import ReceiptArchive from './receipt-archive'
import { Toolbar, Card } from '../shared/ui'

enum ArchivePage {
  Receipts,
  DailyStatements,  
}

const style = {
  margin: '40px',
  minHeight: 'calc(100vh - 140px)'
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

    let content
    switch (this.currentPage) {
      case ArchivePage.Receipts:
        content = <ReceiptArchive navigation={navigation}/>        
        break
      case ArchivePage.DailyStatements:
        content = <div />
        break        
    }    

    return (
      <Card style={style}>
        {content}
      </Card>
    )
  }
}