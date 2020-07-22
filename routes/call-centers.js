const router = require('express').Router();
const keys = require("../config");
const Jimp = require('jimp');
const { uuid } = require('uuidv4');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const path = require('path');

let CallCenter = require('../models/call-center.model');

router.route('/').get((req, res) => {
  CallCenter.find()
    .then(callCenters => res.json(callCenters))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
  CallCenter.find({ creator: req.params.id })
    .then(callCenters => res.json(callCenters))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/call-center/:id').get((req, res) => {
  CallCenter.findById(req.params.id)
    .then(callCenter => res.json(callCenter))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/edit/:id').post((req, res) => {
  CallCenter.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name, about: req.body.about, img: req.body.img },
  )
    .then(callCenter => {
      res.json(callCenter)
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/invitation/accept/:id').post((req, res) => {
  let errors;
  CallCenter.findById(req.params.id)
    .then(callCenter => {
      callCenter.users.forEach(user => {
        if (user.id === req.body.id) {
          errors = 'you already accepted'
          res.json(errors)
        }
      })
      if (!errors) {
        let user = {
          id: req.body.id,
          isAdmin: false
        }
        let users = callCenter.users;
        users[users.length] = user;
        CallCenter.findOneAndUpdate(
          { _id: req.params.id },
          { users: users }
        )
          .then(callCenter => res.json(callCenter))
          .catch(err => res.status(400).json('Error: ' + err))
      }
    })
    .catch((err) => console.log(err))
})

router.route('/edit/users/:id').post((req, res) => {
  CallCenter.findById(req.params.id)
    .then(callCenter => {
      for (let [key, value] of Object.entries(callCenter.users)) {
        if (callCenter.users[key].id === req.body.id) {
          let update = callCenter.users;
          update[key] = req.body
          CallCenter.findOneAndUpdate(
            { _id: req.params.id },
            { users: update }
          )
            .then(callCenter => res.json(callCenter))
            .catch(err => res.status(400).json('Error: ' + err))
        }
      }
    })
})


// New Call Center
router.route('/add/:id').post((req, res) => {
  const creator = req.params.id,
    name = req.body.name,
    about = req.body.about,
    img = req.body.img,
    users = {
      id: req.params.id,
      isAdmin: true
    }

  const newCallCenter = new CallCenter({
    creator,
    name,
    about,
    img,
    users
  });

  newCallCenter.save()
    .then(() => res.json('Call Center added!'))
    .catch(err => res.status(400).json('Error: ' + err));
})

// New Call Script
router.route('/new-call-script/:id').post((req, res) => {
  CallCenter.findOneAndUpdate(
    { _id: req.params.id },
    { callScripts: req.body.callScripts },
  )
    .then(callCenter => {
      res.json(callCenter)
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update Call Script
router.route('/update-call-script/').post((req, res) => {
  CallCenter.findOneAndUpdate(
    { _id: req.body.callCenterID },
    { callScripts: req.body.callScripts }
  )
    .then(callCenter => res.json(callCenter))
    .catch(err => res.status(400).json('Error: ' + err))
})

// Img Upload

const s3 = new aws.S3({
  accessKeyId: keys.AWS_CONFIG.accessKeyId,
  secretAccessKey: keys.AWS_CONFIG.secretAccessKey,
  region: keys.AWS_CONFIG.region
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'call-center-bucket',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, uuid() + '-' + file.originalname)
    }
  }),
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
})

checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/img-upload', upload.single('logo'), (req, res, next) => {
  res.json({ fileName: req.file.key, filePath: req.file.location })
})


module.exports = router;