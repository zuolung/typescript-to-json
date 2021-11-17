const Prettier = require('prettier')

function countStrNumInToken(str, token) {
  let res = 0
  for (let i = 0; i < token.length; i++) {
    if (token.charAt(i) === str) {
      res++
    }
  }

  return res
}

function getRealTokenNext(nextNum, lastTokens) {
  let res = ''
  let next_i = 0
  for (let a = 0; a < lastTokens.length; a++) {
    if (lastTokens[a] !== ' ' && lastTokens[a] !== '\n') {
      next_i++
      if (next_i === nextNum) {
        res = lastTokens[a]
        break
      }
    }
  }

  return res
}

function parseComments(comments = '') {
  let res = {}
  const arr = comments
    .split('\n')
    .filter((item) => item.includes('@'))
    .map((item) => item.replace(/^[\s]+/g, ''))
    .map((item) => item.replace('* ', ''))
    .map((item) => item.replace('@', ''))
    .map((item) => item.replace(/[\s]+/, '##'))

  arr.forEach((item) => {
    const cons = item.split('##')
    res[cons[0]] = cons[1]
  })

  return res
}

function formatTsValue(tsValue) {
  let res = Prettier.format(
    `type temp = {
attr:${tsValue}
}
// END`,
    {
      parser: 'typescript',
      semi: false,
      printWidth: 48,
    },
  ).replace('type temp = {\n', '')
    .replace('attr: ', '')
    .replace(
      `}
// END`,
      '',
    )

  return res
}

module.exports = {
  parseComments: parseComments,
  countStrNumInToken: countStrNumInToken,
  getRealTokenNext: getRealTokenNext,
  formatTsValue: formatTsValue,
}