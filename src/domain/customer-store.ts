import { observable, computed, action } from 'mobx'
import * as firebase from 'firebase'

export enum Gender {
  Male,
  Female,
  Child,
}

export enum MethodOfContact {
  Phone,
  SMS,
  Email,
  None,
}

export class Customer {
  store: CustomerStore
  id: string      // unique id created by firebase
  
  @observable gender: Gender = Gender.Female
  @observable firstName: string = null
  @observable lastName: string = null
  @observable supplement: string = null
  @observable birthDate: Date = null
  @observable phoneNumber: string = null
  @observable email: string = null
  @observable comment: string = null
  @observable preferredMethodOfContact: MethodOfContact = null
  
  @observable appointments: number[] = []     // appointment ids

  constructor(store: CustomerStore) {
    this.store = store
  }

  @computed get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  delete() {
    this.store.deleteCustomer(this.id)
  }

  toJson() {
    return {
      gender: this.gender,
      firstName: this.firstName,
      lastName: this.lastName,
      supplement: this.supplement,
      birthdate: this.birthDate ? this.birthDate.getTime() : null,
      phoneNumber: this.phoneNumber,
      email: this.email,
      comment: this.comment,
      preferredMethodOfContact: this.preferredMethodOfContact,
      appointments: this.appointments,
    }
  }
  
  fromJson(data) {
    this.gender = data.gender
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.supplement = data.supplement
    this.birthDate = data.birthdate ? new Date(data.birthdate) : null
    this.phoneNumber = data.phoneNumber
    this.email = data.email
    this.comment = data.comment
    this.preferredMethodOfContact = data.preferredMethodOfContact     
  }
}

export class CustomerStore {
  userId: string
  @observable customers: Customer[] = []

  maleRunningCustomer: Customer
  femaleRunningCustomer: Customer
  childRunningCustomer: Customer

  load(userId: string) {
    this.userId = userId

    const ref = firebase.database().ref(userId + '/customers')
    ref.on('child_added', (child) => {
      console.log('new customer: ', child.val())
      this.doAddChild(child.key, child.val())
    })

    ref.on('child_changed', (child) => {
      console.log('child_changed ', child)
      this.doUpdateChild(child.key, child.val())
    })

    ref.on('child_removed', (child) => {
      this.doRemoveChild(child.key)
    })

    this.maleRunningCustomer = new Customer(this)
    this.maleRunningCustomer.gender = Gender.Male
    this.maleRunningCustomer.firstName = ''
    this.maleRunningCustomer.lastName = 'Laufkunde Mann'

    this.femaleRunningCustomer = new Customer(this)
    this.femaleRunningCustomer.gender = Gender.Female
    this.femaleRunningCustomer.firstName = ''
    this.femaleRunningCustomer.lastName = 'Laufkunde Frau'

    this.childRunningCustomer = new Customer(this)
    this.childRunningCustomer.gender = Gender.Child
    this.childRunningCustomer.firstName = ''
    this.childRunningCustomer.lastName = 'Laufkunde Kind'
  }

  @action private doAddChild(id, data) {
    const customer = new Customer(this)
    customer.id = id
    customer.fromJson(data)    
    this.customers.push(customer);
  }

  @action private doUpdateChild(id, data) {    
    const customer = this.customers.find(customer => customer.id === id)    
    if (customer) {
      customer.fromJson(data)
    }
  }

  @action private doRemoveChild(id) {
    this.customers = this.customers.filter(customer => customer.id !== id)
  } 

  addCustomer(customer: Customer) {
    const listRef = firebase.database().ref(this.userId + '/customers')
    const ref = listRef.push()     
    console.log(ref)         
    console.log(customer.toJson())
    ref.set(customer.toJson())
  }

  deleteCustomer(id: string) {
    const ref = firebase.database().ref(this.userId + '/customers').child(id)
    ref.remove()
  }

  getAll() {
    return this.customers.slice()
  }

  search(searchText: string) {
    if (!searchText || searchText === '') {
      return this.getAll()
    }

    return this.customers.filter(customer => {
      return (customer.firstName && customer.firstName.toUpperCase().includes(searchText.toUpperCase())) ||
             (customer.lastName && customer.lastName.toUpperCase().includes(searchText.toUpperCase())) ||
             (customer.phoneNumber && customer.phoneNumber.toUpperCase().includes(searchText.toUpperCase())) ||
             (customer.email && customer.email.toUpperCase().includes(searchText.toUpperCase()))

    })
  }
}

export default new CustomerStore()