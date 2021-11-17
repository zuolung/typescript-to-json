const Prettier = require('prettier')
const {
  parseComments,
  countStrNumInToken,
  getRealTokenNext,
  formatTsValue,
} = require('./utils')

/**
 * @param {string} tsStr  typescript code string
 * @return JSON
 */
module.exports = function main(tsStr) {
  tsStr = Prettier.format(tsStr, { semi: false, parser: 'typescript' })
  const { TOKENS } = getAllTokens(tsStr)
  const res = parseTokens(TOKENS)

  return res
}

function getAllTokens(str) {
  let TOKENS = []
  let token = ''
  for (let i = 0; i < str.length; i++) {
    let curItem = str.charAt(i)
    if (curItem === ' ' || curItem === '\n') {
      if (token) TOKENS.push(token.replace(/[\s]+/, ''))
      TOKENS.push(curItem)
      token = ''
    } else {
      token += curItem
    }
  }

  TOKENS = TOKENS.slice(TOKENS.indexOf('export'), TOKENS.length)
  TOKENS = TOKENS.slice(0, TOKENS.indexOf('declare'))

  return { TOKENS }
}

function parseTokens(TOKENS) {
  let STATUS = {
    EXPORT_1: 'EXPORT_WHAT',
    EXPORT_2: 'EXPORT_GET_WHAT',
    EXPORT_3: 'EXPORTING',
  }
  const res = {}
  let status = STATUS.EXPORT_1
  let value = ''
  let count = 0
  let exportName = ''
  let attrName = ''
  let attrNamePrev = ''
  let InBrackets = 0
  let commentsPenddingStr = ''
  let commentsStr = ''

  for (let i = 0; i < TOKENS.length; i++) {
    let curToken = TOKENS[i]
    let nextToken = getRealTokenNext(1, TOKENS.slice(i + 1, TOKENS.length - 1))
    let next2Token = getRealTokenNext(2, TOKENS.slice(i + 1, TOKENS.length - 1))

    if (curToken === '/**' || commentsPenddingStr) {
      commentsPenddingStr += curToken
    }

    if (curToken === 'export' && ['interface', 'type'].includes(nextToken)) {
      if (!res[next2Token]) {
        exportName = next2Token
        res[exportName] = {
          ...parseComments(commentsStr),
        }
        commentsStr = ''
      }
      status = STATUS.EXPORT_2
    }

    if (curToken.includes('}') || curToken.includes('})')) {
      count--
      if (count === 0) {
        status = STATUS.EXPORT_1
        if (attrName && exportName) res[exportName][attrName]['value'] = formatTsValue(value)
        value = ''
        attrNamePrev = ''
        attrName = ''
        InBrackets = 0
        exportName = ''
      }
    }

    if (exportName && count !== 0) {
      if (
        curToken.includes(':') &&
        count < 2 &&
        !curToken.includes('(') &&
        InBrackets === 0
      ) {
        attrNamePrev = attrName
        attrName = curToken.replace(':', '').replace('?', '')
        if (!res[exportName][attrName]) {
          res[exportName][attrName] = {
            ...parseComments(commentsStr),
          }
          commentsStr = ''
        }
        if (curToken.includes('?')) {
          res[exportName][attrName]['require'] = 'false'
        } else {
          res[exportName][attrName]['require'] = 'true'
        }
        if (attrNamePrev) {
          if (!res[exportName]) res[exportName] = {}
          if (!res[exportName][attrNamePrev]) res[exportName][attrNamePrev] = {}
          res[exportName][attrNamePrev]['value'] = formatTsValue(value)
          value = ''
        }
      } else if (status === STATUS.EXPORT_3 && !commentsPenddingStr) {
        value += `${curToken}`
      }
    }

    if (curToken === '*/' && commentsPenddingStr) {
      commentsStr = commentsPenddingStr + curToken
      commentsPenddingStr = ''
    }
    const InBracketsNum1 = countStrNumInToken('(', curToken)
    const InBracketsNum2 = countStrNumInToken(')', curToken)

    if (InBracketsNum1 > 0) {
      InBrackets += InBracketsNum1
    }
    if (InBracketsNum2) {
      InBrackets -= InBracketsNum2
    }

    if (curToken.includes('{') && status === STATUS.EXPORT_2) {
      status = STATUS.EXPORT_3
    }

    if (curToken.includes('{') || curToken.includes('({')) {
      count++
    }
  }

  return res
}

