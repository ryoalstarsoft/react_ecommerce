
class VfCatCfg {
  maxVal (prop) {
    return this.propMaxVal[prop]
  }
  defaultVal (prop) {
    return this.propDefaultVal[prop]
  }
}

class VfCatWtopCfg extends VfCatCfg {
  category = 'wtop'
  partList = ['neckline', 'shoulder', 'sleeve_length', 'coretype', 'top_length']
  propMaxVal = {
    'coretype': 3,
    'top_length': 2,
    'neckline': 4,
    'shoulder': 3,
    'sleeve_length': 5,
    'solid': 1,
    'pattern': 1,
    'details': 1
  }
  propDefaultVal = {
    'coretype': 2,
    'top_length': 1,
    'neckline': 1,
    'shoulder': 3,
    'sleeve_length': 3,
    'solid': 0,
    'pattern': 0,
    'details': 0,
    'color': []
  }
}

class VfCatWshoesCfg extends VfCatCfg {
  category = 'wshoes'
  partList = ['toes', 'covers', 'counters', 'bottoms', 'shafts']
  propMaxVal = {
    'toes': 2,
    'covers': 2,
    'counters': 2,
    'bottoms': 5,
    'shafts': 4,
    'solid': 1,
    'pattern': 1,
    'details': 1
  }
  propDefaultVal = {
    'toes': 1,
    'covers': 0,
    'shafts': 0,
    'counters': 2,
    'bottoms': 5,
    'solid': 0,
    'pattern': 0,
    'details': 0,
    'color': []
  }
}

class VfCatWpantsCfg extends VfCatCfg {
  category = 'wpants'
  partList = ['rise', 'thigh', 'knee', 'ankle']
  propMaxVal = {
    rise: 1,
    thigh: 2,
    knee: 2,
    ankle: 3
  }
  propDefaultVal = {
    rise: 0,
    thigh: 1,
    knee: 1,
    ankle: 1
  }
}

export function getCatCfg (category) {
  if (category === 'wtop') {
    return new VfCatWtopCfg()
  } else if (category === 'wshoes') {
    return new VfCatWshoesCfg()
  } else if (category === 'wpants') {
    return new VfCatWpantsCfg()
  }
}
