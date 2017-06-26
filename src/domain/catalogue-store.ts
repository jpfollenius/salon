import { observable, action } from 'mobx'
import * as firebase from 'firebase'
import productStore, { ProductStore, Product } from './product-store'

const categoryColors = [
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#f1c40f',
    '#34495e',
    '#c0392b',
    '#16a085',
    '#8e44ad',    
    '#e67e22',
    '#3498db',
    '#9b59b6',
    '#f1c40f',
    '#34495e',
    '#c0392b',
    '#8e44ad',
    '#16a085',
]

const categoryTextColors = [
    'black',
    'black',
    'black',
    'black',
    'white',
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
    'black',
    'white',
    'black',
    'black',
    'black',
]

enum CatalogueItemType {
    Service,
    Product,    
}

export class CatalogueItem {
    type: CatalogueItemType
    product: Product

    constructor(type, product) {
        this.type = type
        this.product = product
    }

    static forProduct(product: Product) : CatalogueItem {
        return new CatalogueItem(CatalogueItemType.Product, product)
    }
}

export class CatalogueCategory {
    name: string
    foregroundColor: string
    backgroundColor: string

    constructor(name: string, backgroundColor: string, foregroundColor: string) {
        this.name = name
        this.backgroundColor = backgroundColor
        this.foregroundColor = foregroundColor
    }
}

export class CatalogueStore {
    productStore: ProductStore
    userId: string
    @observable categories: string[]

    constructor(productStore: ProductStore) {
        this.productStore = productStore
    }
    
    load(userId) {
        this.userId = userId
        const db = firebase.database()

        return new Promise((resolve, reject) => {
            this.loadCategories(db, userId)            
            resolve()        
        })        
    }

    @action loadCategories(db, userId) {
        this.categories = []
        const categoriesRef = db.ref(userId + '/catalogue')

        categoriesRef.on('child_added', category => {            
            this.addCategory(category.key)            
        })    

        categoriesRef.on('child_removed', data => {
            this.deleteCategory(data.key)
        })
    }

    @action addCategory(category) {
        this.categories.push(category)
    }

    @action deleteCategory(category) {
        this.categories = this.categories.filter(cat => cat !== category)
    }

    getCategories(): CatalogueCategory[] {        
        return this.categories.map((categoryName, idx) => {
            return new CatalogueCategory(categoryName, categoryColors[idx], categoryTextColors[idx])
        })
    }

    getCategoryContent(category: CatalogueCategory): Promise<CatalogueItem[]> {        
        return new Promise((resolve, reject) => {
            let items = []
            const ref = firebase.database().ref(this.userId + '/catalogue/' + category.name)
            
            ref.once('value', (snapshot) => {            
                for (let key in snapshot.val()) {
                    const productId = snapshot.val()[key].id                    
                    const product = productStore.getProduct(productId)
                    if (product) 
                        items.push(CatalogueItem.forProduct(product))                    
                }

                resolve(items)
            })  
        })
    
    }
}

export default new CatalogueStore(productStore)