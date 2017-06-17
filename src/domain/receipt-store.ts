import { action, observable, computed } from 'mobx'
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
    
    @computed get totalPrice(): number {
        return this.quantity * this.price
    }
}

export class Receipt {
    @observable items: ReceiptItem[] = []

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

export class ReceiptStore {

}

export default new ReceiptStore()