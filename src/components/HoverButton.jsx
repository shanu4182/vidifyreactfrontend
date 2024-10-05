import React from 'react'

export default function HoverButton({title, onClick}) {
  return (
    <button className="shadow__btn" onClick={onClick}>{title}</button>
  )
}
