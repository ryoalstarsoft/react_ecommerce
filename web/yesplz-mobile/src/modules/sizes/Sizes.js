import React from 'react'
import PropTypes from 'prop-types'

import { ProfileBanner } from '@yesplz/core-web/ui-kits/banners'
import { SingleSelect } from '@yesplz/core-web/ui-kits/selects'
import MobilePicker from '@yesplz/core-web/ui-kits/selects/MobilePicker'

// HOC
import { withProfileSetting } from '@yesplz/core-web/hoc'

import {
  CATEGORIES_LABELS,
  CATEGORY_TOPS,
  CATEGORY_SHOES,
  CATEGORY_PANTS,
  SIZES
} from '@yesplz/core-web/config/constants'

// modules
import {
  MenuNavigation,
  MenuButtons
} from '../menus'

import './Sizes.scss'

const PageName = ({ name }) => (
  <div className='PageName'>{name}</div>
)
PageName.propTypes = {
  name: PropTypes.string.isRequired
}

// const SIZE_REGULAR = 'regular'
// const SIZE_PLUS = 'plus'
// const SIZE_PETITE = 'pentite'

const SIZE_OPTIONS_TITLE = {
  'normal': ['CHOOSE YOUR SIZE', 'YOUR SIZE'],
  'waist': ['WAIST', 'WAIST'],
  'width': ['WIDTH', 'WIDTH']
}

class Sizes extends React.Component {
  static propTypes = {
    history: PropTypes.any,
    match: PropTypes.object,
    profile: PropTypes.object,
    updateSizes: PropTypes.func.isRequired
    // location: PropTypes.object
  }

  static defaultProps = {
    profile: {
      sizes: {}
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      pickerValueGroups: {},
      isPickerVisible: false,
      isEdit: false,
      sizes: props.profile.sizes,
      sizeOptionSelected: 'normal'
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.profile.sizes) {
      this.setState({
        sizes: nextProps.profile.sizes
      })
    }
  }

  get category () {
    return this.props.match.params.category
  }

  get sizeKey () {
    return this.props.match.params.sizeKey
  }

  get menuNavigationOptions () {
    return [
      {
        title: CATEGORIES_LABELS[CATEGORY_TOPS].toUpperCase(),
        isActived: true,
        key: CATEGORY_TOPS
      },
      {
        title: CATEGORIES_LABELS[CATEGORY_PANTS].toUpperCase(),
        isActived: false,
        key: CATEGORY_PANTS
      },
      {
        title: CATEGORIES_LABELS[CATEGORY_SHOES].toUpperCase(),
        isActived: false,
        key: CATEGORY_SHOES
      }
    ].map(item => ({
      ...item,
      isActived: this.category === item.key
    }))
  }

  get menuButtonsOptions () {
    return SIZES[this.category].ids.map(key => {
      return {
        title: key.toUpperCase(),
        isActived: key === this.sizeKey,
        key
      }
    })
  }

  get sizesOptions () {
    return SIZES[this.category][this.sizeKey]
  }

  get pickerOptionGroups () {
    const { sizeOptionSelected } = this.state
    const values = SIZES[this.category][this.sizeKey][sizeOptionSelected]

    return {
      [sizeOptionSelected]: values ? values.map(item => {
        return item.join('  ')
      }) : []
    }
  }

  get nullValue () {
    return this.state.isEdit ? 'None' : 'click EDIT to choose your size'
  }

  handleClickMenuNavigation = (item) => {
    const { key } = item
    this.props.history.push(`/profile/sizes/${key}/regular`)
  }

  handleClickMenuButtons = item => {
    const { key } = item
    this.props.history.push(`/profile/sizes/${this.category}/${key}`)
  }

  onSelectClick = (sizeOption) => () => {
    if (this.state.isEdit) {
      this.setState({
        isPickerVisible: true,
        sizeOptionSelected: sizeOption
      })
    }
  }

  handleCategoryChange = (name, value) => {
    this.setState(({ pickerValueGroups }) => ({
      pickerValueGroups: {
        ...pickerValueGroups,
        [name]: value
      }
    }))
  }

  handleCategoryPick = () => {
    const name = this.state.sizeOptionSelected
    const value = this.state.pickerValueGroups[this.state.sizeOptionSelected]
    this.setState(prevState => {
      prevState.isPickerVisible = false
      prevState.sizes[this.category][this.sizeKey][name] = value
      return prevState
    })
  }

  handleEditSize = () => {
    const { isEdit } = this.state
    if (!isEdit) {
      this.setState({
        isEdit: true
      })
    } else {
      this.props.updateSizes(this.state.sizes)
      this.setState({
        isEdit: false
      })
    }
  }

  render () {
    const { isPickerVisible, isEdit, sizes } = this.state
    return (
      <div className='SizesPage'>
        <ProfileBanner />
        <div className='container'>
          <PageName name='SIZES' />
          <MenuNavigation
            menu={this.menuNavigationOptions}
            onClickMenuItem={this.handleClickMenuNavigation}
          />
          {
            this.menuButtonsOptions.length > 1 &&
            <MenuButtons
              menu={this.menuButtonsOptions}
              onClickMenuItem={this.handleClickMenuButtons}
            />
          }
          {
            this.sizesOptions.ids.map(key => {
              return <SingleSelect
                title={SIZE_OPTIONS_TITLE[key][isEdit ? 0 : 1]}
                value={sizes[this.category][this.sizeKey][key] || this.nullValue}
                YPonClick={this.onSelectClick(key)}
                isView={!isEdit}
              />
            })
          }
        </div>

        <div className='BtnSize'>
          <button onClick={this.handleEditSize}>{isEdit ? 'SAVE' : 'EDIT'}</button>
        </div>

        <MobilePicker
          isVisible={isPickerVisible}
          optionGroups={this.pickerOptionGroups}
          valueGroups={this.state.pickerValueGroups}
          onChange={this.handleCategoryChange}
          onPick={this.handleCategoryPick}
          onClose={this.handleClosePicker}
        />
      </div>
    )
  }
}

export default withProfileSetting(Sizes)
