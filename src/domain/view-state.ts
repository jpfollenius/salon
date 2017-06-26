import { observable, computed, action, autorunAsync, toJS, extendObservable } from 'mobx'
import * as firebase from 'firebase'

import { Receipt } from './receipt-store'

export enum View {
    CashPoint,
    Calendar,
    Customers,
    Inventory,
    Archive,
    Settings,
}

export class ViewState {    
    @observable isAuthenticated: boolean            
    @observable currentUserId
    @observable currentView: View
    @observable isLoading: boolean
    @observable currentReceipt

    @observable modal = {
        show: false,    
        title: null,            
        content: null,                
    }
    
    constructor() {        
        this.currentView = View.CashPoint        
        this.currentReceipt = new Receipt(undefined)
        this.load()
    }      

    @computed get asJson() {
        return {            
            currentView: this.currentView
        }
    }

    @action load() {
        const data = localStorage.getItem('viewState')
        if (data) {
            extendObservable(this, JSON.parse(data))
        }
        
        autoSave(this)
    }
    
    @action setCurrentView(view: View) {
        this.currentView = view
    }

    @action login(userId) {        
        this.currentUserId = userId
        this.isAuthenticated = true        
    }

    @action logout() {        
        this.currentUserId = undefined
        this.isAuthenticated = false
        firebase.auth().signOut()
    }

    @action showModal(title: string, content : JSX.Element) {
        this.modal.show = true
        this.modal.title = title
        this.modal.content = content        
    }

    @action closeModal() {
        this.modal.show = false
        this.modal.title = null
        this.modal.content = null        
    }

    @action startLoading() {
        this.isLoading = true
    }

    @action finishedLoading() {
        this.isLoading = false
    }
}

function autoSave(viewState: ViewState) {
    let firstRun = true
    autorunAsync(() => {          
        const data = JSON.stringify(viewState.asJson)
        if (!firstRun) {
            localStorage.setItem('viewState', data)
        }

        firstRun = false
    }, 300)
}

export default new ViewState()