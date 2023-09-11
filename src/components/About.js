import React, { useContext, useEffect } from 'react'
import noteContext from '../context/notes/noteContext'

const About = () => {
  const a = useContext(noteContext)
  // useEffect(() => {
  //   a.update()
  //   // eslint-disable-next-line
  // }, []);
  return (
   <>
   <h1>This is About of {a.state.name} and he is from {a.state.branch}</h1>
   </>
  )
}

export default About
