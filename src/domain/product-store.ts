import { observable, computed, action } from 'mobx'
import * as firebase from 'firebase'

export class Product {
    id: number
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
            this.loadCategories(db, userId)
            this.loadProducts(db, userId)
            resolve()        
        })        
    }

    @action loadCategories(db, userId) {
        this.categories = []
        const categoriesRef = db.ref(userId + '/categories')

        categoriesRef.on('child_added', category => {
            console.log('child_added: ', category.val())
            this.addCategory(category.val())            
        })    

        categoriesRef.on('child_removed', data => {
            this.deleteCategory(data.val())
        })
    }

    @action loadProducts(db, userId) {
        this.products = [
            new Product(this, 0, 'Schnitt', 12, '1234'),
            new Product(this, 1, 'Föhnen', 6, '1235'),
            new Product(this, 2, 'Schnitt + Föhnen', 16, '1236'),
        ]
    }

    @action addCategory(category) {
        this.categories.push(category)
    }

    @action deleteCategory(category) {
        this.categories = this.categories.filter(cat => cat !== category)
    }

    getProductCategories(): string[] {        
        return this.categories
    }

    getProducts(productCategory: number): Product[] {
        return this.products.slice()
    }

    searchProducts(searchTerm: string): Product[] {
        return this.products.filter(product => {
            return product.name.toUpperCase().includes(searchTerm.toUpperCase())
        })
    }

    findProductByBarcode(barcode: string) {
        let foundProduct = null

        this.products.forEach(product => {
            console.log('barcodes ', barcode, product.barcode)
            if (product.barcode === barcode) {
                console.log('found ', product)
                foundProduct = product
            }
        })

        return foundProduct
    }
    
    getProduct(id: number): Product {
        let foundProduct = null

        this.products.map(product => {
            if (product.id === id)
                foundProduct = product
        })

        return foundProduct
    }
}

export default new ProductStore()

