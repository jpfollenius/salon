import { observable, computed, action } from 'mobx'
import * as firebase from 'firebase'

export class Product {
    id: number
    store: ProductStore

    @observable name: string
    @observable price: number

    constructor(store, id, name, price) {
        this.store = store
        this.id = id        
        this.name = name        
        this.price = price
    }
}

export class ProductStore {    
    @observable categories: string[]

    constructor() {
    }
    
    loadProducts(userId) {
        const db = firebase.database()

        return new Promise((resolve, reject) => {
            this.loadCategories(db, userId)
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

    @action addCategory(category) {
        this.categories.push(category)
    }

    @action deleteCategory(category) {
        this.categories = this.categories.filter(cat => cat !== category)
    }

    getProductCategories(): string[] {        
        return this.categories
    }
}

export default new ProductStore()

