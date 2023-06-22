import React from 'react'
import PropTypes from 'prop-types'

const Like = ({ isLiked }) => {
  let fill = 'none'
  if (isLiked) {
    fill = 'rgba(0, 0, 0, 0.87)'
  }

  return (
    <svg width='20px' height='18px' viewBox='0 0 20 18' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink'>
      <title>Shape</title>
      <desc>Created with Sketch.</desc>
      <defs />
      <g id='Page-1' stroke='none' strokeWidth='1' fill={fill} fillRule='evenodd'>
        <g id='Mobile-v0.8-Q&amp;A-1' transform='translate(-294.000000, -37.000000)' fillRule='nonzero' stroke='rgba(0, 0, 0, 0.87)' strokeWidth='2'>
          <g id='mobile-menu-bar-Off' transform='translate(32.000000, 33.000000)'>
            <g id='menu-favorite-off' transform='translate(263.000000, 5.000000)'>
              <path d='M8.5090156,15.1676158 C8.29305422,14.9922339 3.20289075,10.8487437 1.47698219,8.93087984 C-0.415351709,6.82736369 -0.402947634,3.80198023 1.50575499,1.89326629 C2.47983609,0.919032207 3.75949744,0.431915164 5.0391701,0.431915164 C6.31884384,0.431915164 7.5985305,0.919032207 8.57266224,1.89326629 L9.02489737,2.34550034 L9.47744816,1.89296033 C10.4514108,0.918998271 11.7311707,0.431915164 13.0106742,0.431915164 C14.2904912,0.431915164 15.570054,0.918862524 16.5445585,1.89296033 C18.4528544,3.80206965 18.4652698,6.82746496 16.5732311,8.9306773 C14.8468135,10.8488471 9.7561415,14.9923352 9.54007885,15.1676158 C9.39801295,15.2831573 9.22835394,15.345342 9.058097,15.345342 C8.83202684,15.3448421 8.65562577,15.286788 8.5090156,15.1676158 Z' id='Shape' />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

Like.propTypes = {
  isLiked: PropTypes.bool
}

Like.defaultProps = {
  isLiked: false
}

export default Like
