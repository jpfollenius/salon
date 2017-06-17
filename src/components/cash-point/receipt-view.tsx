import * as React from 'react'
import { observer } from 'mobx-react'

import * as Table from 'react-bootstrap/lib/Table'

interface ReceiptViewProps {

}

@observer
export default class ReceiptView extends React.Component<ReceiptViewProps, {}> {
    render() {    
        return (
            <Table responsive hover striped condensed className='receipt-table'>
                <thead>
                    <tr>
                        <th></th>
                        <th className='col-right'>Anzahl</th>
                        <th className='col-right'>Einzelpreis</th>
                        <th className='col-right'>Preis</th>                        
                    </tr>
                </thead>
                <tbody>
                    <tr>                        
                        <td>Schnitt</td>
                        <td className='col-right'>1</td>
                        <td className='col-right'>12 €</td>
                        <td className='col-right'>12 €</td>                        
                    </tr>
                    <tr>                        
                        <td>Gutschein 20€</td>
                        <td className='col-right'>2</td>
                        <td className='col-right'>20 €</td>
                        <td className='col-right'>40 €</td>                        
                    </tr>
                </tbody>
            </Table>
        )
    }
}