import * as firebase from 'firebase'

const Auth = {
     authenticate: (email, password) => {         
         return new Promise((resolve, reject) => {            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .catch(error => {                    
                    reject(error.message)
                })    
                .then(() => {                    
                    resolve()
                })
         })
     }
}

export default {
    Auth,
}