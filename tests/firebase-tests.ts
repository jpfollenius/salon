import * as firebase from 'firebase'

beforeAll(() => {
    var config = {
        apiKey: "AIzaSyDELsFWT5i-RxIN9xd6QDMhAuTblU8Nqjg",
        authDomain: "test02-3b2d5.firebaseapp.com",
        databaseURL: "https://test02-3b2d5.firebaseio.com",
        storageBucket: "test02-3b2d5.appspot.com",
        messagingSenderId: "58605010762"
    };

    firebase.initializeApp(config)    
})

test('Can connect to database', () => {
    var database = firebase.database()
    
})

test('Can write to and read from database', () => {
    var testRef = firebase.database().ref('test')

    testRef.set({
        name: "Jan",
        age: 32,
    })

    testRef.once('value', snapshot => {        
        expect(snapshot.val()).toMatchObject({
            name: "Jan",
            age: 32,
        })
    })
})

test('Can delete from database', () => {
    var obsoleteRef = firebase.database().ref('obsolete')
    obsoleteRef.set({})

    obsoleteRef.remove()
})