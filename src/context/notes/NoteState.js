import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const initialNotes = []
  const [notes, setNotes] = useState(initialNotes)

  //Get all notes
  const getNotes = async () => {
    //TODO: API call
    //API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
    })
    const json = await response.json()
   
    setNotes(json)
  }
   


  //Add a note
  const addNote = async (title, description, tag) => {
   
    //TODO: API call
    //API call
    const response = await fetch(`${host}/api/notes/createnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json()
    setNotes(notes.concat(note))
  }

  //Delete a note
  const deleteNote = async (id) => {
    
    //TODO: API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
    });
    const json = await response.json()
    
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)
  }


  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token")
      },
      body: JSON.stringify({ title, description, tag }),
    });
    
    const json = response.json();
    

    //Logic to update note
    const newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      let element = newNotes[index];
      if (element._id === id) {
        element.title = title
        element.description = description
        element.tag = tag
        break;
      }
    }
    setNotes(newNotes)
  }
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;