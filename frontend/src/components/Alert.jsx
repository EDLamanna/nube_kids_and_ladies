import React from 'react'

function Alert ({ message, type, onClose }) {
  const alertClass = `alert ${
    type === 'error' ? 'alert-danger' : 'alert-success'
  }`

  return (
    <div className={alertClass} role='alert'>
      {message}
      <button
        type='button'
        className='close'
        aria-label='Close'
        onClick={onClose}
      >
        <span aria-hidden='true'>&times</span>
      </button>
    </div>
  )
}

export default Alert
