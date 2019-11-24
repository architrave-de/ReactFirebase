import { DB } from './firebase'
import { dayToYear, dayWithYearNumber } from '../helpers/timeFunctions'

export class API {
  getCollectionData(collection, orderBy, orderQuery) {
    const collectionData = orderBy
      ? DB.collection(collection).orderBy(orderBy, orderQuery)
      : DB.collection(collection)
    return collectionData.get().then(querySnapshot => {
      let dbValues = []
      querySnapshot.forEach(doc => {
        dbValues.push(doc.data())
      })
      return dbValues
    })
  }

  dbCollection() {
    return {
      appManifest: 'manifest',
      sections: 'sections',
      players: 'players',
      days: 'days'
    }
  }

  get currentDayNumber() {
    return parseInt(dayWithYearNumber({ day: dayToYear({}) }))
  }

  get players() {
    console.log(this.dbCollection.players, this.dbCollection().players)
    return DB.collection(this.dbCollection().players)
  }

  get todayScores() {
    return this.getCollectionData(this.dbCollection().points)
  }
}

const apiCall = new API()
export default apiCall
