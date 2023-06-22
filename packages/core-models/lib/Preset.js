import { FAVORITE_PRESETS, CUSTOM_PRESET_NAME } from '@yesplz/core-web/config/constants'
import uniqBy from 'lodash/uniqBy'
import reject from 'lodash/reject'
import filter from 'lodash/filter'
import map from 'lodash/map'
import max from 'lodash/max'

const { localStorage } = window

export default class Preset {
  /**
   * get favorite presets from local storage
   */
  static getFavoritePresets () {
    return JSON.parse(localStorage.getItem(FAVORITE_PRESETS)) || []
  }

  /**
   * get favorite preset names from local storage
   */
  static getFavoritePresetNames () {
    return map(Preset.getFavoritePresets(), 'name')
  }

  /**
   * create a new preset and save it to list of favorit presets in local storage
   * @param {Object} preset
   * @param {string} string
   */
  static savePreset (preset, name) {
    let favoritePresets = Preset.getFavoritePresets()

    // find last preset key index
    const customPresets = filter(favoritePresets, { name: CUSTOM_PRESET_NAME })
    const lastPresetKeyIndex = customPresets.reduce((keyIndex, preset) => (
      max([keyIndex, Number(preset.key.replace('custom-', ''))])
    ), 0)

    favoritePresets = uniqBy([ {
      ...preset,
      key: `custom-${lastPresetKeyIndex + 1}`,
      name,
      favorite: true
    },
    ...favoritePresets ], 'key')

    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * remove preset from list of favorit presets in local storage
   * this function is similar to `unlike`, but it uses only the name of the preset
   * @param {Object} preset
   * @param {string} string
   */
  static removePreset (preset, name) {
    let favoritePresets = Preset.getFavoritePresets()
    favoritePresets = reject(favoritePresets, { ...preset, name })
    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * save preset to list of favorit presets in local storage
   * @param {Object} preset
   */
  static like (preset) {
    let favoritePresets = Preset.getFavoritePresets()

    favoritePresets = uniqBy([ ...favoritePresets, { ...preset, favorite: true } ], 'name')
    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }

  /**
   * remove preset from list of favorit presets in local storage
   * @param {Object} preset
   */
  static unlike (preset) {
    let favoritePresets = Preset.getFavoritePresets()

    // if preset.key available, use that as a key to unlike preset
    // else, use preset.name
    if (preset.key) {
      favoritePresets = reject(favoritePresets, { key: preset.key })
    } else {
      favoritePresets = reject(favoritePresets, { name: preset.name })
    }

    localStorage.setItem(FAVORITE_PRESETS, JSON.stringify(favoritePresets))
  }
}
