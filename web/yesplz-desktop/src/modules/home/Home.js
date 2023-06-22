import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import history from '@yesplz/core-web/config/history'
import { Button } from '@yesplz/core-web/ui-kits/buttons'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import withTrackingProvider from '@yesplz/core-web/hoc/withTrackingProvider'
import { fetchRecommendedProducts, fetchProducts } from '@yesplz/core-redux/ducks/products'
import { ProductList } from '@yesplz/core-web/modules/products'
import withTutorial from '../../hoc/withTutorial'
import { AdvancedPresetList } from '@yesplz/core-web/modules/presets'
import { SectionTitle } from '@yesplz/core-web/ui-kits/misc'
import { Input } from '@yesplz/core-web/ui-kits/forms'
import { formatPresetName } from '@yesplz/core-web/utils'

import {
  CATEGORY_PANTS,
  CATEGORY_SHOES,
  CATEGORY_TOPS,
  CATEGORIES_LABELS,
  YESPLZ_VIDEO_LINK,
  INSTAGRAM_LINK
} from '@yesplz/core-web/config/constants'

import InstagramSvg from '@yesplz/core-web/assets/svg/instagram-glyph.svg'

import './home.scss'

class Home extends Component {
  static propTypes = {
    products: PropTypes.array.isRequired,
    fetchProducts: PropTypes.func.isRequired
  }

  static defaultProps = {
  }

  componentDidMount () {
    // make sure recommended fetch only run once
    this.fetchNewProducts()
  }

  componentWillUnmount () {
    // fetch recommended products on leave
    this.fetchNewProducts()
  }

  fetchNewProducts = () => {
    const { fetchProducts } = this.props
    fetchProducts(CATEGORY_TOPS, { new: 1 }, 3)
    fetchProducts(CATEGORY_PANTS, { new: 1 }, 3)
    fetchProducts(CATEGORY_SHOES, { new: 1 }, 3)
  }

  handleClickExpore = category => () => {
    history.push(
      `/products/${category}/list?listingView=single&page=new`
    )
  }

  handleClickEditorPick = (preset) => () => {
    history.push(
      `/products/${preset.category}/list?listingView=single&page=editorspick&preset=${formatPresetName(preset.name)}`
    )
  }

  handleClickSendEmail = () => { }

  render () {
    const {
      products
    } = this.props

    return (
      <div id='MainScroll' className='Home' style={{ paddingBottom: 100 }}>
        {/* new arrival section */}
        <div className='Home-section'>
          <SectionTitle
            title='New Arrivals'
          />
          {
            [CATEGORY_TOPS, CATEGORY_PANTS, CATEGORY_SHOES].map(category => (
              <React.Fragment>
                <SectionTitle
                  title={CATEGORIES_LABELS[category]}
                  small
                  onClick={this.handleClickExpore(category)}
                />
                <ProductList
                  products={products[category].data.slice(0, 3)}
                  className='Recommended-products'
                  style={{ overflow: 'hidden' }}
                  showOriginalPrice
                  // showHighResImage
                  show
                  combined
                />
                <Button kind='secondary' onClick={this.handleClickExpore(category)} >
                  EXPLORE
                </Button>
                <br />
              </React.Fragment>
            ))
          }
        </div>

        {/* editor's pick section */}

        <div className='Home-section'>
          <SectionTitle
            title='Editor Picks'
          />
          <div className='container-wide'>
            <AdvancedPresetList
              presetMatchesCount={4}
              useMinimalPreset
              titleBellowPreset
              defaultViewBoxSvg={[0, 0, 304, 214]}
              onClickGroupTitle={this.handleClickEditorPick}
            />
          </div>

        </div>

        <div className='Home-section'>
          <SectionTitle
            title='How it works'
          />
          <div className='container-wide'>
            <div className='Home-video'>
              <iframe width='100%' height='100%' src={YESPLZ_VIDEO_LINK} frameBorder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
            </div>
          </div>
        </div>

        <div className='Home-section'>
          <div className='container-wide'>
            <div className='Home-Footer'>
              <div className='Home-Footer-Menu'>
                <div className='Title Title-main'><Link to={'#'}>YESPLZ</Link></div>
                <div className='Title Title-sub'><Link to={'/faq'}>FAQ</Link></div>
                <div className='Title Title-sub'><Link to={'/profile/sizes'}>MY SIZE</Link></div>

                <div className='Icons'>
                  <a href={INSTAGRAM_LINK} target='_blank'><img src={InstagramSvg} alt='InstagramSvg' /></a>
                </div>
              </div>
              <div className='Home-Footer-MailForm'>
                <div className='Title'><h1>Let us know what you think</h1></div>
                <form action=''>
                  <Input type='text' label='YOUR EMAIL' name='email' customStyle={{
                    width: '50%'
                  }} />
                  <Input type='text' label='YOUR MESSAGE' name='message' />
                  <Button kind='secondary' onClick={this.handleClickSendEmail} >
                    SEND
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  products: state.products,
  recommendedProducts: state.products.recommended.data.slice(0, 3)
})

export default compose(
  withTutorial(),
  connect(mapStateToProps, {
    fetchRecommendedProducts,
    fetchProducts
  }),
  withTrackingProvider('Home')
)(Home)
