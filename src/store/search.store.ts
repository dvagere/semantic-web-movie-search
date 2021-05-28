const initialSearchState = {
  results: null,
  query: {}
}

function addSearchResults(draft: any, payload: any) {
  draft.results = payload
  return draft
}

function addSearchQuery(draft: any, payload: any) {
  draft.query = {...draft.query, ...payload}
  return draft
}

function resetState(draft: any) : any {
  draft.results = null;
  draft.query = {};
  return draft;
}

function SearchReducer(draft: any, action: any) {
  console.log("Aciton, ",  action);
  const actions: any = {
    resetState: () => resetState(draft),
    addSearchQuery: () => addSearchQuery(draft, action.payload),
    addSearchResults: () => addSearchResults(draft, action.payload),
  }
  draft = actions[action.type]()
}

export { SearchReducer, initialSearchState }
