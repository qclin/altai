const admin = require('firebase-admin');
var Q = require('q');
const Firestore = require('@google-cloud/firestore');
var serviceAccount = require('./altai-demo-42092-firebase-adminsdk-qisqg-a1780ac476.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://altai-demo-42092.firebaseio.com"
});

var db = admin.firestore();

// // add data


function addNewEntry(payload){
  var deferred = Q.defer();
  console.log('111:  ', payload);
  var newDocRef = db.collection('agent_utterances').doc();

  console.log("111:  addNewEntry : " , payload);

  newDocRef.set({payload}).then(function() {
      console.log("111:  Document successfully written!");

  }).catch(function(error) {
      console.error("111 : Error writing document: ", error);
  });
}


// var setAda = docRef.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: 1815
// });


function getAgentUtterances(){
  var deferred = Q.defer();

  var docRef = db.collection('agent_utterances').get().then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
          deferred.resolve(doc.data());
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
        deferred.resolve(err)

  });
  return deferred.promise;
}

module.exports = {
  addNewEntry, getAgentUtterances
}
