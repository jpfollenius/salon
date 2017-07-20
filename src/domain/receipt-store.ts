import { action, observable, computed, toJS } from 'mobx'
import * as moment from 'moment'
import * as firebase from 'firebase'

import productStore, { Product, ProductStore } from './product-store'
import { Customer } from './customer-store'

export class ReceiptItem {
    @observable product: Product
    @observable quantity: number
    @observable price: number    
    
    constructor(product: Product, quantity: number) {        
        this.product = product
        this.quantity = quantity
        this.price = product.price
    }

    @computed get name(): string {
        return this.product.name
    }
    
    @computed get totalPrice(): number {
        return this.quantity * this.price
    }
}

export class Receipt {
    store: ReceiptStore
    number: number
    id: string
    date: Date
    @observable items: ReceiptItem[] = []
    @observable customer: Customer

    constructor(store: ReceiptStore, id: string) {
        this.store = store
        this.id = id
    }

    @computed get totalPrice(): number {
        return this.items.reduce((sum, item) => {
            return sum + item.totalPrice
        }, 0)
    }

    @computed get totalQuantity(): number {
        return this.items.reduce((sum, item) => {
            return sum + item.quantity
        }, 0)
    }

    @action addProduct(product: Product) {
        let foundProduct = false

        this.items.forEach(item => {
            if (item.product.id === product.id) {
                item.quantity++
                foundProduct = true                
            }
        })
            
        if (!foundProduct)
            this.items.push(new ReceiptItem(product, 1))
    }

    @action deleteItem(idx: number) {
        this.items.splice(idx, 1)
    }

    @action clear() {
        this.items = []
    }

    save() {
        this.store.addReceipt(this)
        this.clear()
    }
    
}

export class Receipts {
    ref
    productStore: ProductStore
    store: ReceiptStore
    @observable receipts: Receipt[] = []
    @observable isLoading = true

    constructor(store, ref, productStore) {
        this.ref = ref
        this.store = store
        this.productStore = productStore
    }

    @action release() {
        this.receipts = []
        this.ref.off()
    }

    setDateRange(from: Date, to: Date) {                
        this.startLoading()
        this.release()

        const fromDate = moment(from).startOf('day').toDate()
        const toDate = moment(to).endOf('day').toDate()
        const filteredRef = this.ref.startAt(fromDate.getTime()).endAt(toDate.getTime())

        filteredRef.once('value', (snapshot) => this.finishedLoading())

        filteredRef.on('child_added', (child) => {             
            this.doAdd(child.key, child.val())
        })
    }

    @action startLoading() {
        this.isLoading = true
    }

    @action finishedLoading() {
        this.isLoading = false
    }

    @action doAdd(key, child) {
        const receipt = new Receipt(this.store, key)
        receipt.number = child.number
        receipt.date = new Date(child.date)
        receipt.items = child.items.map(item => {
            const productId = item.productId  
            const product = this.productStore.getProduct(productId)
            
            // TODO: what if product does no longer exist?
            
            const receiptItem = new ReceiptItem(product, item.quantity)
            receiptItem.price = item.price

            return receiptItem
        })       

        this.receipts.push(receipt)
    }

    getAll(): Receipt[] {
        return this.receipts.reverse()
    }
}

export class ReceiptStore {
    userId: string
    productStore: ProductStore

    constructor(productStore: ProductStore) {
        this.productStore = productStore
    }

    load(userId: string) {
        this.userId = userId
    }

    createReceipts() {        
        return new Receipts(this, firebase.database().ref(this.userId + '/receipts'), this.productStore)
    }

    generateReceiptNumber(): Promise<number> {
        let receiptNumber
        const ref = firebase.database().ref(this.userId + '/nextReceiptNumber')        

        return new Promise((resolve, reject) => {
            ref.transaction(function(currentNumber) {
                return (currentNumber || 0) + 1
            }, function(err, committed, snapshot) {
                if (err) {
                    reject('Failed to generate receipt number')                    
                }

                resolve(snapshot.val())
            })
        })        
    }

    addReceipt(receipt: Receipt) { 
        const receiptData = {
            date: moment().toDate().getTime(),
            items: receipt.items.map(item => {
                return {
                    price: item.price,
                    productId: item.product.id,
                    quantity: item.quantity
                }
            })   
        }

        this.generateReceiptNumber().then((receiptNumber) => {            
            const listRef = firebase.database().ref(this.userId + '/receipts')
            const receiptRef = listRef.push()
          
            receiptRef.setWithPriority({
                number: receiptNumber,
                ...receiptData,     
            }, receiptData.date)     
        })
    }   
}

export default new ReceiptStore(productStore)