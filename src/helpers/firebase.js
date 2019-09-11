import app from 'firebase/app'

export class Firebase {
    constructor(config) {
        app.initializeApp(config)
    }
}