export const formatPresetName = preset => preset.toLowerCase().split(' ').join('-')
export const parsePresetName = preset => preset.split('-').join(' ')
