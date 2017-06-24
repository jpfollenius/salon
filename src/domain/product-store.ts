import { observable, computed, action } from 'mobx'
import * as firebase from 'firebase'

export class Product {
    id: number
    store: ProductStore
    
    @observable name: string
    @observable price: number
    @observable barcode: string
    category: number

    constructor(store, id, name, price, barcode, category) {
        this.store = store
        this.id = id        
        this.name = name        
        this.price = price
        this.barcode = barcode
        this.category = category
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
            this.addCategory(category.val())            
        })    

        categoriesRef.on('child_removed', data => {
            this.deleteCategory(data.val())
        })
    }

    @action loadProducts(db, userId) {
        this.products = [
            new Product(this, 0, 'Schnitt', 28, '1234', 0),
            new Product(this, 1, 'Maschinen-Schnitt', 12, '1235', 0),
            new Product(this, 2, 'Kopfmassage', 8, '1236', 0),
            new Product(this, 3, 'Bart formen', 10, '1237', 0),
            new Product(this, 4, 'Farbe Herren', 24, '1238', 0),

            new Product(this, 5, 'Schnitt', 30, '1239', 1),
            new Product(this, 6, 'Neu Schnitt', 40, '1240', 1),
            new Product(this, 7, 'Spitzen schneiden', 20, '1241', 1),

            new Product(this, 8, 'Föhnen Mittel', 15, undefined, 2),
            new Product(this, 9, 'Föhnen Lang', 20, undefined, 2),
            new Product(this, 10, 'Hochstecken 30 Min', 28, undefined, 2),
            new Product(this, 11, 'Hochstecken 60 Min', 55, undefined, 2),
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
        return this.products.filter(product => {
            return (product.category === productCategory)            
        })
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

