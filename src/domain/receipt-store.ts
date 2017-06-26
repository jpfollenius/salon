import { action, observable, computed, toJS } from 'mobx'
import * as moment from 'moment'
import * as firebase from 'firebase'
import { Product } from './product-store'

export class ReceiptItem {
    @observable product: Product
    @observable quantity: number
    @observable price: number

    constructor(product: Product, quantity: number) {        
        this.product = product
        this.quantity = quantity
        this.price = product.price
    }

    toJson() {
        return {
            productId: this.product.id,
            quantity: this.quantity,
            price: this.price
        }
    }
    
    @computed get totalPrice(): number {
        return this.quantity * this.price
    }
}

export class Receipt {
    id: string
    @observable items: ReceiptItem[] = []

    constructor(id: string) {
        this.id = id
    }

    toJson() {
        const itemsJson = this.items.map(item => item.toJson())

        return {
            items: itemsJson
        }
    }

    @computed get totalPrice(): number {
        return this.items.reduce((sum, product) => {
            return sum + product.totalPrice
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
    
}

export class Receipts {
    ref
    @observable receipts: Receipt[] = []

    constructor(ref) {
        this.ref = ref
    }

    @action release() {
        this.ref.off()
    }

    setDateRange(from: Date, to: Date) {
        const fromDate = moment(from).startOf('day').toDate()
        const toDate = moment(to).endOf('day').toDate()
        const filteredRef = this.ref.startAt(fromDate.getTime()).endAt(toDate.getTime())

        filteredRef.on('child_added', (child) => {
            this.doAdd(child.key, child.val())
        })
    }

    @action doAdd(key, child) {
        const receipt = new Receipt(key)
        receipt.items = child.items
        this.receipts.push(receipt)
    }
}

export class ReceiptStore {
    userId: string

    load(userId: string) {
        this.userId = userId
    }

    createReceipts() {
        return new Receipts(firebase.database().ref(this.userId + '/receipts'))
    }

    addReceipt(receipt: Receipt) {
        console.log(this.userId + '/receipts')
        const listRef = firebase.database().ref(this.userId + '/receipts')
        const receiptRef = listRef.push()
        receiptRef.setWithPriority(receipt.toJson(), moment().toDate().getTime())     
    }   
}

export default new ReceiptStore()