const Modal = ({ show, handleClose, title, children }) => {
  return (
    <div
      className={`modal ${show ? 'show' : ''}`}
      tabIndex='-1'
      aria-labelledby='modalLabel'
      aria-hidden={!show}
      style={{ display: show ? 'block' : 'none' }}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='modalLabel'>
              {title}
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={handleClose}
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>{children}</div>
        </div>
      </div>
      {show && <div className='fade show' />}
    </div>
  )
}

export default Modal
