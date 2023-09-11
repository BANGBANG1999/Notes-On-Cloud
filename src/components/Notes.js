
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import NoNoteAlert from './NoNoteAlert';
import { useNavigate } from 'react-router-dom';


const Notes = (props) => {
  let navigate = useNavigate()
  const Context = useContext(noteContext)
  const { notes, getNotes, editNote } = Context;
  useEffect(() => {
    if (localStorage.getItem("token")){
      getNotes()
    }
    else{
      navigate("/login")
    }
  }, [])

  const ref = useRef(null);
  const closeRef = useRef(null);

  const [note, setNote] = useState({etitle: "", edescription: "", etag: ""})

  const updateNote = (currentNote) => {
    setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag})
    ref.current.click()
    
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    editNote(note.id, note.etitle, note.edescription, note.etag)
    closeRef.current.click()
    props.showAlert("Updated Successfully", "success")
  }
  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  return (
    <>
      <AddNote showAlert={props.showAlert}/>

      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form style={{ marginTop: "25px" }}>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input type="text" className="form-control" name="etitle" id="etitle" value={note.etitle} onChange={handleChange} placeholder="" />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <textarea className="form-control" name="edescription" id="edescription" value={note.edescription} onChange={handleChange} rows="3"></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input type="text" className="form-control" name="etag" id="etag" value={note.etag} onChange={handleChange} placeholder="" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" ref={closeRef} data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 3 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={handleSubmit}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row" style={{ marginTop: "25px" }}>
        <h2>Your Notes</h2>
        <div className="container" style={{marginTop:"20px"}}>
        {notes.length === 0 && <NoNoteAlert />}
        </div>
        {notes.map((note) => {
          return <NoteItem showAlert={props.showAlert} key={note._id} updateNote={updateNote} note={note} />
        })}
      </div>
    </>
  )
}

export default Notes
