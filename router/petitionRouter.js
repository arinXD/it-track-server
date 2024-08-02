const express = require('express');
const isOwner = require('../middleware/isOwnerMiddleware');
const router = express.Router();
const { getPetitionByEmail, sendPetition, editPetition,
     softDeletePetition, deletePetition, getDeletedPetitionByEmail,
     retrievePetition, getPetitionByStatus, approvePetition, 
     getPetitionById} = require('../controller/petitionController');

// get
router.get("/approves/:status", getPetitionByStatus)
router.get("/:id", getPetitionById)
router.get("/users/:email", getPetitionByEmail)
router.get("/users/:email/retrieve", getDeletedPetitionByEmail)

// post
router.post("/", sendPetition)

// update
router.put("/:id", editPetition)
router.put("/retrieves/multiple", retrievePetition)
//   approve or reject petition
router.put("/approves/:pid/:email/:status", approvePetition)

// deleted
router.delete("/multiple", softDeletePetition)
router.delete("/multiple/force", deletePetition)


module.exports = router