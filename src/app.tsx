import * as React from 'react'
import { render } from 'react-dom'
import { autorun, useStrict } from 'mobx'
import * as firebase from 'firebase'

import Main from './components/main'
import viewState from './domain/view-state'
import productStore from './domain/product-store'
import appointmentStore from './domain/appointment-store'
import catalogueStore from './domain/catalogue-store'
import receiptStore from './domain/receipt-store'
import * as BigCalendar from 'react-big-calendar'
import * as moment from 'moment'

// Setup moment
moment.locale('de')

// Setup BigCalendar
BigCalendar.momentLocalizer(moment)

// Import custom CSS
import './main.css'

// MobX: Only modify observables from actions
useStrict(true)

// Configure Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDELsFWT5i-RxIN9xd6QDMhAuTblU8Nqjg",
    authDomain: "test02-3b2d5.firebaseapp.com",
    databaseURL: "https://test02-3b2d5.firebaseio.com",
    storageBucket: "test02-3b2d5.appspot.com",
    messagingSenderId: "58605010762"
} 

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {    
    if (user) {
        viewState.login(user.uid)
    } else {
        viewState.logout()
    }
})
        
// Load store data when user logs in / changes
autorun(() => {    
    if (viewState.currentUserId) {
        viewState.startLoading()
        productStore.load(viewState.currentUserId)   
            .then(() => appointmentStore.load(viewState.currentUserId))
            .then(() => receiptStore.load(viewState.currentUserId))
            .then(() => catalogueStore.load(viewState.currentUserId))
            .then(viewState.finishedLoading.bind(viewState))
    }        
})

const stores = {
    viewState,
    productStore, 
    appointmentStore,
    catalogueStore,
    receiptStore,
}

render(
    <Main {...stores} />,
    document.getElementById('root')
)