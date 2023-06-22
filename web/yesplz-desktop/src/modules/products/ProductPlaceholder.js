import React, { Component } from 'react'
import { Placeholder } from '@yesplz/core-web/ui-kits/misc'

const TEXT_LINE_HEIGHT = 18

export default class ProductPlaceholder extends Component {
  render () {
    return (
      <div className='Product Product-placeholder'>
        <div className='container'>
          <div className='Product-images'>
            <Placeholder style={{ width: 315, height: 480, margin: 'auto' }} />
          </div>
          <div className='Product-detail' style={{ height: 300 }}>
            <h3><Placeholder style={{ width: 100, height: TEXT_LINE_HEIGHT }} /></h3>
            <h4><Placeholder style={{ width: 228, height: TEXT_LINE_HEIGHT, marginBottom: 10 }} /></h4>
            <p><Placeholder style={{ width: 320, height: TEXT_LINE_HEIGHT }} /></p>
            <div className='Product-price'>
              <Placeholder style={{ width: 116, height: TEXT_LINE_HEIGHT }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
