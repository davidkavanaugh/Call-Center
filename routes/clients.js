const express = require("express");
const router = express.Router();

const Client = require("../models/client.model");
const CallCenter = require ("../models/call-center.model");

router.route('/').post((req, res) => {
  const caseInsensitive = (str) => {
    if (str) {
      return new RegExp(str, "i")
    } else return str
  }

  let client = {
    firstName: caseInsensitive(req.body.firstName),
    lastName: caseInsensitive(req.body.lastName),
    dob: req.body.dob,
    phoneNumber: req.body.phoneNumber,
    _id: req.body.id
  }

  let searchQuery = { }
    for (let [key, value] of Object.entries(client)) {
      if (client[key]) {
        searchQuery[key] = value
      }
    }

  if (Object.keys(searchQuery).length > 0) {
    Client.find(searchQuery)
      .then(clients => {
        let searchResults = [];
        CallCenter.find({ _id: req.body.callCenter })
          .then(callCenter => {
            callCenter[0].clients.forEach(clientId => {
              for (let [key] of Object.entries(clients)) {
                if (clients[key]._id == clientId) {
                  searchResults.push(clients[key])
                }
              }
            })
            res.json(searchResults)
          })
      })
      .catch(err => console.log(err))
  }
});

router.route('/client/').post((req, res) => {
  Client.findOne({ _id: req.body.id })
    .then(client => res.json(client))
    .catch(err => console.log(err))
})

router.route('/new/').post((req, res) => {
  let client = { }
  for (let [key, value] of Object.entries(req.body)) {
    if (req.body[key]) {
      if (key !== 'callCenter') {
        client[key] = value
      }
    }
  }

  new Client(client).save()
  .then((client) => {
    let clientsArray = [];
    CallCenter.find({ _id: req.body.callCenter })
      .then(res => {
        clientsArray = res[0].clients
        clientsArray.push(client._id)
        CallCenter.findOneAndUpdate(
          { _id: req.body.callCenter },
          { clients: clientsArray }
        )
          .then(res => console.log(res))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    res.json(client)
  })
  .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/alert/').post((req, res) => {
  let client = req.body.client;
  Client.findOneAndUpdate({ _id: client._id }, { alert: client.alert })
    .then(client => {
       res.json(client)
    })
    .catch((err) => console.log(err))
})

router.route('/update/').post((req, res) => {
  let update={};
  Client.findById(req.body._id)
    .then(client => {
      if (client.firstName !== req.body.firstName) {
        update.firstName = req.body.firstName
      }
      if (client.lastName !== req.body.lastName) {
        update.lastName = req.body.lastName
      }
      if (client.phoneNumber !== req.body.phoneNumber) {
        update.phoneNumber = req.body.phoneNumber
      }
      if (client.dob !== req.body.dob) {
        update.dob = req.body.dob
      }
      if (client.email !== req.body.email) {
        update.email = req.body.email
      }
      if (client.address !== req.body.address) {
        update.address = req.body.address
      }

      Client.findOneAndUpdate({ _id: req.body._id }, update)
        .then(client => res.json(client))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.route('/add-note/:id/').post((req, res) => {
  let note = {
    subject: req.body.subject,
    content: req.body.content,
    date: req.body.date,
    user: req.body.user,
    _id: req.body._id
  }
  Client.findOne({ _id: req.params.id }, (err, client) => {
    if (client.notes) {
      client.notes.push(note)
    } else {
      client.notes = [note];
    }
    
    client.save((err) => {if (err) {console.log(err)}})
  })
  .then(client => {
    res.json(client)
  })
  .catch(err => console.log(err))
})

router.route('/save-note/').post((req, res) => {
  Client.findOne({ _id: req.body.clientId }, (err, client) => {
    let note = client.notes.find(note => note._id === req.body.note._id);
    note.content = req.body.note.content
    client.notes[client.notes.indexOf(note)] = note;
    client.markModified('notes');
    client.save((err) => {if (err) {console.log(err)}})
  })
  .then(client => res.json(client))
  .catch(err => console.log(err))
})

module.exports = router;