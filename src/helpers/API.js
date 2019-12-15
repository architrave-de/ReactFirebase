import { DB } from './firebase'
import { dayToYear, dayWithYearNumber } from '../helpers/timeFunctions'
import { firestore } from 'firebase'

export class API {
  getToken() {
    return DB.collection(this.dbCollection().appManifest)
      .get()
      .then(collection => {
        let dbValues = []
        collection.forEach(doc => {
          dbValues.push(doc.data())
        })
        return dbValues[0].slackToken
      })
      .catch(error => {
        console.log('Error getting slackToken: ', error)
      })
  }

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
    return DB.collection(this.dbCollection().players)
  }

  get playersList() {
    return DB.collection(this.dbCollection().players)
      .orderBy('totalPoints', 'desc')
      .get()
      .then(querySnapshot => {
        let players = []
        querySnapshot.forEach(function(doc) {
          players.push({ id: doc.id, ...doc.data() })
        })
        return players
      })
      .catch(error => {
        console.log('Error getting the results: ', error)
      })
  }

  lastPlayerId() {
    return this.players.get().then(doc => {
      let lastId = null
      doc.forEach(doc => {
        lastId = doc.id
      })
      return lastId
    })
  }

  addPlayer({
    id,
    name,
    slackName,
    image,
    monthlyRecords = {},
    email,
    totalPoints = 0
  }) {
    return DB.collection(this.dbCollection().players)
      .doc(id)
      .set({ name, slackName, image, monthlyRecords, email, totalPoints })
      .then(player => {
        console.log('the player has beed added')
      })
      .catch(e => console.log(e))
  }

  updatePlayer(player) {
    DB.collection(this.dbCollection().players)
      .doc(player.id)
      .set({ ...player })
      .then(player => {
        console.log('the player has beed updated---> ', player)
      })
      .catch(e => console.log(e))
  }

  createNewDayEntry({ dayNumber }) {
    return DB.collection('days')
      .add({
        insertDate: new Date(),
        dayNumber: dayNumber,
        rounds: []
      })
      .then(entryData => {
        return entryData
      })
  }

  addRound({ dayNumber, round }) {
    const insertRound = doc => {
      return DB.collection('days')
        .doc(doc.id)
        .update({
          rounds: firestore.FieldValue.arrayUnion({ ...round })
        })
    }

    return DB.collection('days')
      .where('dayNumber', '==', dayNumber)
      .get()
      .then(data => {
        if (!!data.docs[0]) {
          return insertRound(data.docs[0])
        } else {
          return this.createNewDayEntry({ dayNumber: dayNumber }).then(doc => {
            return insertRound(doc)
          })
        }
      })
  }

  get todayScores() {
    return this.getCollectionData(this.dbCollection().points)
  }

  getDayMatches({ dayNumber }) {
    return DB.collection('days')
      .where('dayNumber', '==', dayNumber)
      .get()
      .then(querySnapshot => {
        let matches = []
        querySnapshot.forEach(function(doc) {
          matches.push(doc.data())
        })
        return matches
      })
      .then(data => data)
      .catch(error => {
        console.log('Error getting the results: ', error)
      })
  }
}

const apiCall = new API()
export default apiCall

console.log(apiCall.getToken())
