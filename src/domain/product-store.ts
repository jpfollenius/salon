import { observable, computed, action } from 'mobx'
import * as firebase from 'firebase'

export class Product {
    id: string
    store: ProductStore
    
    @observable name: string
    @observable price: number
    @observable barcode: string
    
    constructor(store, id, name, price, barcode) {
        this.store = store
        this.id = id        
        this.name = name        
        this.price = price
        this.barcode = barcode        
    }
}

export class ProductStore {    
    @observable categories: string[]
    @observable products: Product[]

    constructor() {
    }
    
    load(userId) {
        const db = firebase.database()

        return new Promise((resolve, reject) => {
            this.loadProducts(db, userId)
            resolve()        
        })        
    }

    @action loadProducts(db, userId) {
        this.products = [
            new Product(this, 0, 'Schnitt', 28, '1234'),
            new Product(this, 1, 'Maschinen-Schnitt', 12, '1235'),
            new Product(this, 2, 'Kopfmassage', 8, '1236'),
            new Product(this, 3, 'Bart formen', 10, '1237'),
            new Product(this, 4, 'Farbe Herren', 24, '1238'),

            new Product(this, 5, 'Schnitt', 30, '1239'),
            new Product(this, 6, 'Neu Schnitt', 40, '1240'),
            new Product(this, 7, 'Spitzen schneiden', 20, '1241'),

            new Product(this, 8, 'Föhnen Mittel', 15, undefined),
            new Product(this, 9, 'Föhnen Lang', 20, undefined),
            new Product(this, 10, 'Hochstecken 30 Min', 28, undefined),
            new Product(this, 11, 'Hochstecken 60 Min', 55, undefined),
        ]
    }

    searchProducts(searchTerm: string): Product[] {
        return this.products.filter(product => {
            return product.name.toUpperCase().includes(searchTerm.toUpperCase())
        })
    }

    getFavoriteProducts(count: number) {
        return this.products.filter((product, idx) => idx < 4)
    }

    findProductByBarcode(barcode: string) {
        let foundProduct = null

        this.products.forEach(product => {            
            if (product.barcode === barcode) {                
                foundProduct = product
            }
        })

        return foundProduct
    }
    
    getProduct(id: string): Product {
        let foundProduct = null

        this.products.map(product => {
            if (product.id === id)
                foundProduct = product
        })

        return foundProduct
    }
}

export default new ProductStore()

