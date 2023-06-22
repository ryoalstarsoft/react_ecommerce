import React from 'react'
import PropTypes from 'prop-types'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS } from '../../config/constants'
import { ThumbnailPicker, ThumbnailPickerOption } from '../../ui-kits/selects'
import MaterialCottonSvg from '../../assets/svg/material-cotton.svg'
import MaterialSilkSvg from '../../assets/svg/material-silk.svg'
import MaterialWrinkleFreeSvg from '../../assets/svg/material-wrinkle-free.svg'
import MaterialDenimSvg from '../../assets/svg/material-denim.svg'
import MaterialSpandexSvg from '../../assets/svg/material-spandex.svg'
import MaterialWoolSvg from '../../assets/svg/material-wool.svg'
import MaterialSuedeSvg from '../../assets/svg/material-suede.svg'
import MaterialLeatherSvg from '../../assets/svg/material-leather.svg'
import MaterialGlossySvg from '../../assets/svg/material-glossy.svg'
import MaterialFabricSvg from '../../assets/svg/material-fabric.svg'

const MaterialSelect = ({ name, values, category, onChange }) => (
  <ThumbnailPicker name={name} values={values} onChange={onChange} selectedStyle='half' canUnselect>
    {getOptions(category)}
  </ThumbnailPicker>
)

MaterialSelect.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.array,
  category: PropTypes.string,
  onChange: PropTypes.func
}

MaterialSelect.defaultProps = {
  onChange: (name, value) => {}
}

const getOptions = (category) => {
  switch (category) {
    case CATEGORY_TOPS:
      return [
        <ThumbnailPickerOption key='cotton' label='Cotton' value='cotton'>
          <img src={MaterialCottonSvg} alt='Cotton' />
        </ThumbnailPickerOption>,
        <ThumbnailPickerOption key='silk' label='Silk' value='silk' thumbnailStyle={{ padding: 0 }}>
          <img src={MaterialSilkSvg} alt='material-silk' />
        </ThumbnailPickerOption>,
        <ThumbnailPickerOption key='wrinkle-free' label='Wrinkle Free' value='wrinkle-free'>
          <img src={MaterialWrinkleFreeSvg} alt='Wrinkle Free' />
        </ThumbnailPickerOption>
      ]
    case CATEGORY_PANTS:
      return [
        <ThumbnailPickerOption key='denim' label='Denim' value='denim'>
          <img src={MaterialDenimSvg} alt='Denim' />
        </ThumbnailPickerOption>,
        <ThumbnailPickerOption key='spandex' label='Spandex' value='spandex'>
          <img src={MaterialSpandexSvg} alt='Spandex' />
        </ThumbnailPickerOption>,
        <ThumbnailPickerOption key='wool' label='Wool' value='wool'>
          <img src={MaterialWoolSvg} alt='Wool' />
        </ThumbnailPickerOption>
      ]
    case CATEGORY_SHOES:
      return [
        <ThumbnailPickerOption key='suede' label='Suede' value='suede'>
          <img src={MaterialSuedeSvg} alt='Suede' />
        </ThumbnailPickerOption>,
        <ThumbnailPickerOption key='leather' label='Leather' value='leather'>
          <img src={MaterialLeatherSvg} alt='Leather' />
        </ThumbnailPickerOption>,
        <ThumbnailPickerOption key='glossy' label='Glossy' value='glossy'>
          <img src={MaterialGlossySvg} alt='Glossy' />
        </ThumbnailPickerOption>,
        <ThumbnailPickerOption key='fabrics' label='Fabrics' value='fabric'>
          <img src={MaterialFabricSvg} alt='Fabrics' />
        </ThumbnailPickerOption>
      ]
    default:
      return null
  }
}

export default MaterialSelect
