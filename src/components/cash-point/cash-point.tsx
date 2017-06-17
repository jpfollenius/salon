import * as React from 'react'
import { observer, inject } from 'mobx-react'

import Catalogue from './catalogue'
import ReceiptView from './receipt-view'

interface CashPointProps {

}

@observer
export default class CashPoint extends React.Component<CashPointProps, {}> {
    render() {
        return (
            <div className='cashpoint-layout'>
                <div className='cashpoint-catalogue'>
                    <Catalogue />
                </div>
                <div className='cashpoint-bill'>
                    <ReceiptView />
                </div>
            </div>
        )
    }
}