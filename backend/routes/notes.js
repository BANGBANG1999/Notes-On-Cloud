const express = require('express');
const router = express.Router();
const getuser = require('../middleware/getuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes  using get : /api/notes/fetchallnotes     Login required
router.get('/fetchallnotes', getuser, async (req, res) => {
    try {
        const notes = await Notes.find({ userId: req.user.id })
        res.json(notes)     
    } catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
})
//ROUTE 2: Create a new  note  using post : /api/notes/createnote     Login required
router.post('/createnote', [
    body('title').notEmpty().withMessage('Title is required.').escape().isLength({ min: 3 }).withMessage('Title must be at least 3 characters.'),
    body('description').notEmpty().withMessage('Description is required.').escape().isLength({ min: 5 }).withMessage('Username must be at least 5 characters.'),
], getuser, async (req, res) => {
    try {
        const {title, description, tag} = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const note = new Notes({
            title, description, tag, userId: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server error' });
    }
})

//ROUTE 3: Update an existing note  using put : /api/notes/updatenote     Login required
router.put('/updatenote/:id', getuser, async (req, res) => {
    try {
    const {title, description, tag} = req.body;
    const newNote = {};
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}
 
    //Find the note to update ande update it
    let note = await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Not found")}
    if(note.userId.toString() !== req.user.id){
       return res.status(401).send("Not allowed");
    }
    
    note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note})
} catch (error) {
    res.status(500).json({ error: 'Internal Server error' });
}
})

//ROUTE 4: Delete an existing note  using DELETE : /api/notes/deletenote     Login required
router.delete('/deletenote/:id', getuser, async (req, res) => {
    //Find the note to delete ande delete it
    try {
    let note = await Notes.findById(req.params.id)
    if(!note){return res.status(404).send("Not found")}
    if(note.userId.toString() !== req.user.id){
       return res.status(401).send("Not allowed");
    }
    
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"Success" : "Note Deleted", note: note})
} catch (error) {
    res.status(500).json({ error: 'Internal Server error' });
}
})

module.exports = router;