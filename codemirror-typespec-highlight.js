import { StreamLanguage, LanguageSupport, HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

const tspLanguage = StreamLanguage.define({
  name: 'typespec',

  startState: () => ({
    inString: false,
    stringType: null,
    inComment: false,
    inMultilineComment: false,
  }),

  token(stream, state) {
    // Handle comments
    if (state.inComment) {
      if (stream.match(/\*\//)) {
        state.inComment = false
        return 'comment'
      }
      stream.skipToEnd()
      return 'comment'
    }
    if (state.inMultilineComment) {
      if (stream.match(/\*\//)) {
        state.inMultilineComment = false
        return 'comment'
      }
      stream.next()
      return 'comment'
    }
    if (stream.match(/\/\//)) {
      stream.skipToEnd()
      return 'comment'
    }
    if (stream.match(/\/\*/)) {
      state.inMultilineComment = true
      return 'comment'
    }

    // Handle decorators
    if (stream.match(/\b@[a-zA-Z_]\w*\b/)) {
      return 'decorator'
    }

    // Handle strings
    if (state.inString) {
      if (stream.match(/\\./)) return 'string'
      if (stream.match(state.stringType)) {
        state.inString = false
        state.stringType = null
      } else {
        stream.next()
      }
      return 'string'
    }
    if (stream.match(/"""/)) {
      state.inString = true
      state.stringType = /"""/
      return 'string'
    }
    if (stream.match(/"/) || stream.match(/'/)) {
      state.inString = true
      state.stringType = stream.current()
      return 'string'
    }

    // Handle keywords
    if (
      stream.match(
        /\b(namespace|model|scalar|op|interface|union|using|is|extends|enum|alias|return|void|never|if|else|projection|dec|extern|fn|const|import)\b/
      )
    ) {
      return 'keyword'
    }

    // Handle boolean literals
    if (stream.match(/\b(true|false)\b/)) {
      return 'bool'
    }

    // Handle numeric literals
    if (stream.match(/\b\d+(\.\d+)?\b/)) {
      return 'number'
    }

    // Handle property names
    if (stream.match(/\b[a-zA-Z_]\w*\s*\?{0,1}:/)) {
      stream.backUp(1) // Back up before the colon
      return 'propertyName'
    }

    // Handle identifiers
    if (stream.match(/\b[a-zA-Z_]\w*\b/)) {
      return 'variable'
    }

    // Handle operators
    if (stream.match(/[+\-*\/=<>!&|?:]/)) {
      return 'operator'
    }

    // Handle punctuation
    if (stream.match(/[.,;(){}[\]<>]/)) {
      return 'punctuation'
    }

    stream.next()
    return null
  },

  // Define comment syntax
  lineComment: '//',
  blockCommentStart: '/*',
  blockCommentEnd: '*/',
})

const myHighlightStyle = HighlightStyle.define([
  { tag: t.comment, color: '#999' },
  { tag: t.string, color: 'rgb(64, 129, 63)' },
  { tag: t.number, color: 'rgb(194, 72, 61)' },
  { tag: t.bool, color: 'rgb(194, 72, 61)' },
  { tag: t.keyword, color: 'rgb(166, 38, 164)' },
  { tag: t.operator, color: 'rgb(62, 110, 215)' },
  { tag: t.variableName, color: 'rgb(62, 110, 215)' },
  { tag: t.propertyName, color: 'rgb(194, 72, 61)' },
  { tag: t.punctuation, color: 'rgb(56, 58, 66)' },
  { tag: t.function, color: 'rgb(62, 110, 215)', fontWeight: 'bold' },
  { tag: t.meta, color: 'rgb(166, 38, 164)' }, // 用于装饰器
])

export function lang() {
  return new LanguageSupport(tspLanguage, [syntaxHighlighting(myHighlightStyle)])
}
