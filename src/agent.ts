import * as firebase from 'firebase'

const Auth = {
     authenticate: (email, password) => {         
         return new Promise((resolve, reject) => {            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .catch(error => {
                    console.log(error)
                    reject(error.message)
                })    
                .then(() => {
                    console.log('resolved')
                    resolve()
                })
         })
     }
}

export default {
    Auth,
}