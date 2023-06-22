// api
export const BASE_API_PATH = process.env.REACT_APP_BASE_API_PATH || '/api/'
export const BASE_IMG_PATH = process.env.REACT_APP_BASE_IMG_PATH || '/'
export const DEBUG_PARAM = 'dbg'
export const PRD_CATEGORY = process.env.REACT_APP_PRD_CATEGORY || 'wtop'

// local storage
export const FAVORITE_PRESETS = 'favorite_presets'
export const FILTERS = 'filters'
export const LAST_BODY_PART = 'last_body_part'
export const ONBOARDING_COMPLETED = 'onboarding_completed'

// platforms
export const IS_MOBILE = JSON.parse(process.env.REACT_APP_IS_MOBILE)

// presets
export const CUSTOM_PRESET_NAME = 'Custom Preset'

// product count that will be showed for each page
export const PRODUCT_COUNT_PER_PAGE = parseInt(process.env.REACT_APP_PRODUCT_PER_PAGE, 10) || 10

// fabric colors dictionary
export const FABRIC_COLORS = {
  red: '#E03E3E',
  beige: '#ECD5C0',
  purple: '#7F3EE0',
  blue: '#3E60E0',
  green: '#3EE059',
  yellow: '#E0D03E',
  black: '#000000',
  brown: '#663300',
  pink: '#F0A4BD',
  pastel: 'linear-gradient(-145deg, #FEF7A3 4%, #E8F7AC 21%, #83F5D7 52%, #F19EC2 98%, #C683F2 98%)',
  orange: '#E08F3E',
  grey: '#999999',
  white: '#FFFFFF'
}

// categories
export const CATEGORY_TOPS = 'wtop'
export const CATEGORY_SHOES = 'wshoes'
export const CATEGORY_PANTS = 'wpants'

// product list filters
export const FILTER_OCCASIONS = [
  {
    name: 'work',
    label: 'Work'
  },
  {
    name: 'casual',
    label: 'Casual'
  },
  {
    name: 'workout',
    label: 'Workout'
  }
]
export const FILTER_TYPES = [
  {
    name: 'wtop',
    label: 'Top'
  },
  {
    name: 'wpants',
    label: 'Pants'
  },
  {
    name: 'wshoes',
    label: 'Shoes'
  }
]
export const FILTER_SALES = [
  {
    name: '30%',
    label: '30%'
  },
  {
    name: '50%',
    label: '50%'
  },
  {
    name: '70%',
    label: '70%'
  }
]
export const FILTER_PRICES = [
  {
    name: '-50',
    label: 'UNDER $50',
    range: [0, 50]
  },
  {
    name: '50-100',
    label: '$50 - $100',
    range: [50, 100]
  },
  {
    name: '100-150',
    label: '$100 - $150',
    range: [100, 150]
  },
  {
    name: '150-300',
    label: '$150 - $300',
    range: [150, 300]
  },
  {
    name: '300-',
    label: '$300+',
    range: [300]
  }
]

export const STYLES_LABELS = {
  [CATEGORY_TOPS]: [],
  [CATEGORY_PANTS]: [],
  [CATEGORY_SHOES]: []
}

// end of product list filters
export const CATEGORIES_LABELS = {
  wtop: 'Tops',
  wpants: 'Pants',
  wshoes: 'Shoes'
}

export const SIZES = {
  [CATEGORY_TOPS]: {
    ids: ['regular', 'plus', 'petite'],
    regular: {
      ids: ['normal'],
      normal: [
        ['00', 'XXS'],
        ['0', 'XS'],
        ['2', 'XS'],
        ['4', 'S'],
        ['6', 'S'],
        ['8', 'M'],
        ['10', 'M'],
        ['12', 'L'],
        ['14', 'L'],
        ['16', 'XL'],
        ['18', 'XXL'],
        ['20', 'XXL'],
        ['22', 'XXXL']
      ]
    },
    plus: {
      ids: ['normal'],
      normal: [
        ['12W', '0X'],
        ['14W', '1X'],
        ['6W', '1X'],
        ['18W', '2X'],
        ['20W', '2X'],
        ['22W', '3X'],
        ['24W', '3X'],
        ['26W', '4X'],
        ['28W', '4X']
      ]
    },
    petite: {
      ids: ['normal'],
      normal: [
        ['00', 'XXS'],
        ['0', 'XS'],
        ['0P', 'PXS'],
        ['2P', 'PS'],
        ['4P', 'PS'],
        ['6P', 'PM'],
        ['8P', 'PM'],
        ['10P', 'PL'],
        ['12P', 'PL'],
        ['14P', 'PXL'],
        ['16P', 'PXL'],
        ['18P', 'PXXL']
      ]
    }
  },
  [CATEGORY_PANTS]: {
    ids: ['regular', 'plus', 'petite'],
    regular: {
      ids: ['normal', 'waist'],
      normal: [
        ['00', 'XXS'],
        ['0', 'XS'],
        ['2', 'XS'],
        ['4', 'S'],
        ['6', 'S'],
        ['8', 'M'],
        ['10', 'M'],
        ['12', 'L'],
        ['14', 'L'],
        ['16', 'XL'],
        ['18', 'XXL'],
        ['20', 'XXL'],
        ['22', 'XXXL']
      ],
      waist: [
        ['23', '24', ''],
        ['25', '26', ''],
        ['25', '26', '27'],
        ['26', '27', '28'],
        ['27', '28', '29'],
        ['28', '29', '30'],
        ['29', '30', '31'],
        ['30', '31', '32'],
        ['31', '32', '33'],
        ['32', '33', '34'],
        ['33', '34', '35'],
        ['34', '35+', ''],
        ['35+', '', '']
      ]
    },
    plus: {
      ids: ['normal'],
      normal: [
        ['12W', '0X'],
        ['14W', '1X'],
        ['6W', '1X'],
        ['18W', '2X'],
        ['20W', '2X'],
        ['22W', '3X'],
        ['24W', '3X'],
        ['26W', '4X'],
        ['28W', '4X']
      ]
    },
    petite: {
      ids: ['normal', 'waist'],
      normal: [
        ['00', 'XXS'],
        ['0', 'XS'],
        ['0P', 'PXS'],
        ['2P', 'PS'],
        ['4P', 'PS'],
        ['6P', 'PM'],
        ['8P', 'PM'],
        ['10P', 'PL'],
        ['12P', 'PL'],
        ['14P', 'PXL'],
        ['16P', 'PXL'],
        ['18P', 'PXXL']
      ],
      waist: [
        ['23', '24', ''],
        ['25', '26', ''],
        ['25', '26', ''],
        ['25', '26', ''],
        ['27', '28', ''],
        ['27', '28', '29'],
        ['28', '29', '30'],
        ['29', '30', '31'],
        ['31', '32', '33'],
        ['31', '32', '33'],
        ['34', '35', ''],
        ['35+', '', '']
      ]
    }
  },

  [CATEGORY_SHOES]: {
    ids: ['regular'],
    regular: {
      ids: ['normal', 'width'],
      normal: [
        ['4', '4.5'],
        ['5', '5.5'],
        ['6', '6.5'],
        ['7', '7.5'],
        ['8', '8.5'],
        ['9', '9.5'],
        ['10', '10.5'],
        ['11', '11.5'],
        ['12', '12.5'],
        ['13', '13.5'],
        ['14', '14.5'],
        ['15', '15.5']
      ],
      width: [
        ['SUPER SLIM', 'AAAA'],
        ['SLIM', 'AAA'],
        ['NARROW', 'AA'],
        ['MEDIUM', 'M'],
        ['WIDE', 'W'],
        ['EXTRA WIDE', 'WW']
      ]
    }
  }
}

export const YESPLZ_VIDEO_LINK = 'https://www.youtube.com/embed/bvmxRUITN9I'
export const INSTAGRAM_LINK = 'https://www.instagram.com/yesplzfashion/'
