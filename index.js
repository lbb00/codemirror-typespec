import { basicSetup, EditorView } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { languageServer } from 'codemirror-languageserver'
import { lang as tspLang } from './codemirror-typespec-highlight.js'

const serverUri = 'ws://localhost:8080'

const fileName = 'test.tsp'

var ls = languageServer({
  serverUri,
  rootUri: 'file:///',
  rootUri: null,
  workspaceFolders: null,
  documentUri: `file:///${fileName}`,
  languageId: 'Typespec',
})

const initialContent = `
import "@typespec/json-schema";

using TypeSpec.JsonSchema;

@jsonSchema
namespace Schemas;

model Person {
  name: string;
  address: Address;
  @uniqueItems nickNames?: string[];
  cars?: Car[];
}

model Address {
  street: string;
  city: string;
  country: string;
}

model Car {
  kind: "ev" | "ice";
  brand: string;
  @minValue(1900) year: int32;
}
`

new EditorView({
  state: EditorState.create({
    doc: initialContent,
    extensions: [ls, tspLang()],
  }),
  extensions: [basicSetup, EditorView.lineWrapping],
  parent: document.body,
})
