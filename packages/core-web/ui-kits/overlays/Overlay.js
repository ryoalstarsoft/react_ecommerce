import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import preventDefault from '@yesplz/core-web/utils/preventDefault'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import CloseSvg from '../../assets/svg/close-black.svg'
import './Overlay.scss'

const Overlay = ({ title, children, className, isVisible, onClose }) => {
  const [ isReachedEnd, setReachedEnd ] = useState(false)

  // make default window unscrollable
  useEffect(() => {
    if (isVisible) {
      window.ontouchmove = preventDefault
    } else {
      window.ontouchmove = null
    }
    return () => {
      window.ontouchmove = null
    }
  }, [isVisible])

  const handleYReachEnd = () => {
    setReachedEnd(true)
  }

  const handleScrollUp = () => {
    if (isReachedEnd) {
      setReachedEnd(false)
    }
  }

  return (
    <Transition timeout={{ enter: 100, exit: 200 }} show={isVisible} transition='fadeInUp'>
      <div className={classNames(`Overlay ${className}`, { 'is-reachedEnd': isReachedEnd })} style={{ animationDuration: '300ms' }}>
        <PerfectScrollbar
          className='Overlay-scroll'
          onYReachEnd={handleYReachEnd}
          onScrollUp={handleScrollUp}
          style={{ touchAction: 'none' }}>
          <div className='container'>
            <div className='Overlay-header'>
              <h2>{title}</h2>
              <div className='Overlay-close' onClick={onClose}>
                <img src={CloseSvg} />
              </div>
            </div>
            <div className='Overlay-content'>
              {children}
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </Transition>
  )
}

Overlay.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  isVisible: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired
}

export default Overlay
