import {DB} from './firebase'


export class API {
    getAppManifest (collection) {
        return DB.collection(collection).get().then((querySnapshot) => {
            let dbValues = []
            querySnapshot.forEach((doc) => {
                    dbValues.push(doc.data())
            })
            return dbValues
    })
    }

    dbCollection() {
        return {
            appManifest: 'manifest',
        }
    }
}

const apiCall = new API()
export default apiCall