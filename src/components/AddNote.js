import React from 'react'
import noteContext from '../context/notes/noteContext'
import { useState, useContext } from 'react';

const AddNote = (props) => {
    const Context = useContext(noteContext)
    const { addNote } = Context;

    const [note, setNote] = useState({title: "", description: "", tag: ""})

    const handleSubmit = (e) => {
        e.preventDefault()
        addNote(note.title, note.description, note.tag)
        setNote({title: "", description: "", tag: ""})
        props.showAlert("Added Successfully", "success")
    }
    const handleChange = (e) => {
        setNote({...note, [e.target.name] : e.target.value})
    }

    return (
        <div className="container my-4" style={{ marginLeft: "-0.6vw" }}>
            <h2>Add Note</h2>
            <form style={{ marginTop: "25px" }}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" name="title" id="title" value={note.title} onChange={handleChange} placeholder="" required minLength={3}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" name="description" id="description" value={note.description} onChange={handleChange} rows="3" required minLength={5}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" name="tag" id="tag" value={note.tag} onChange={handleChange} placeholder="" required/>
                </div>
                <input disabled={note.title.length < 3 || note.description.length < 5} className="btn btn-primary" type="submit" onClick={handleSubmit} value="Add note"></input>
            </form>
        </div>
    )
}

export default AddNote
