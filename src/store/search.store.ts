const initialSearchState = {
  results: null,
  query: {}
}

function addSearchResults(draft: any, payload: any) {
  draft.results = payload
  return draft
}

function addSearchResultsOffset(draft: any, payload: any) {
  if(!draft.results){
    draft.results = payload;
    return draft;
  }
  let items = draft.results?.results?.bindings;
  const newItems = payload.results?.results?.bindings;
  if(newItems && items){
    items = [...items].concat(items);
  }
  draft.results.results.bindings = items;
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
  const actions: any = {
    resetState: () => resetState(draft),
    addSearchQuery: () => addSearchQuery(draft, action.payload),
    addSearchResults: () => addSearchResults(draft, action.payload),
    addSearchResultsOffset: () => addSearchResultsOffset(draft, action.payload),
  }
  draft = actions[action.type]()
}

export { SearchReducer, initialSearchState }
