import './App.css';

import { useImmerReducer } from "use-immer"

import { SearchReducer, initialSearchState } from './store/search.store'

import { MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AppStateContext from "./ContextApi/AppStateContext"
import DispatchContext from "./ContextApi/DispatchContext"

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';

import theme from './assets/jss/theme';
import AdvancedSearch from './pages/AdvancedSearch';
import SingleMovieDetails from './pages/SingleMovieDetails';

function App() {

  const [SearchState, SearchDispatcher] = useImmerReducer(SearchReducer, initialSearchState)

  const StateProviders = { SearchState }

  const DispatchProviders = { SearchDispatcher }

  return (

    <AppStateContext.Provider value={{ ...StateProviders }}>
      <DispatchContext.Provider value={{ ...DispatchProviders }}>
        <div className="App">
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/search" component={SearchResults} exact />
                <Route path="/movie/single" component={SingleMovieDetails} exact />
                <Route path="/movie/:id" component={SingleMovieDetails} exact />
                <Route path="/search/advanced" component={AdvancedSearch} exact />
              </Switch>
            </BrowserRouter>
          </MuiThemeProvider>
        </div>
      </DispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export default App;
