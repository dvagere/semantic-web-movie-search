import React from 'react';
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import AppStateContext from '../../ContextApi/AppStateContext';
import DispatchContext from '../../ContextApi/DispatchContext';
import CircularProgress from "@material-ui/core/CircularProgress";

import Page from '../../layouts/Page';
import SingleMovieCard from '../../components/SingleMovieCard';
import { generateKeywordsQuery } from '../../utils/query';

interface Props {

}

const SearchResults:React.FC<Props> = (props) => {

  const { SearchState } = React.useContext(AppStateContext)
  const { SearchDispatcher } = React.useContext(DispatchContext)

  const [loading, setLoading] = React.useState(false);
  
  const [ queryString, setQueryString ] = React.useState<string>(SearchState.query?.keywords ? SearchState.query.keywords : "");

  const [page, setPage] = React.useState(1);
  const [lastPageReached, setLastPageReached] = React.useState(false);

  const handleSearch = async (offsetting?: number) => {

    setLoading(true)

    SearchDispatcher({type: "addSearchResults", payload: null});

    let offset = 0;

    if(offsetting){
      let currPage = page;
      if(offsetting < 0){
        currPage = currPage - 1
      }

      offset = currPage * (SearchState.results?.results?.bindings ? SearchState.results?.results?.bindings.length : 0)
    }
    
    const query = generateKeywordsQuery(queryString, offset);

    await axios.get(`${process.env.REACT_APP_DBPEDIA_URL}/sparql/?query=${encodeURIComponent(query)}`, {headers: {Accept: 'application/json'}})
      .then(response => {
        SearchDispatcher({type: "addSearchQuery", payload: {keywords: queryString}});
        SearchDispatcher({type: "addSearchResults", payload: response.data});
        if(response.data.results?.bindings?.length < 25){
          setLastPageReached(true);
        }
      })
      .catch(error => {
        console.log("<<<<<<<<<< Error: ", error);
      });

      setLoading(false)
  }

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  const handleNextPage = async () => {
    await handleSearch(1)
    setPage(page + 1);
  }

  const handlePrevPage = async () => {
    await handleSearch(-1)
    setPage(page - 1);
  }

  return (
    <Page>
      <Grid container>
        <Grid item xs={12} sm={12} md={9} lg={7} xl={6}>
          <div style={{width: "100%"}}>
            <FormControl fullWidth >
              <TextField
                autoFocus
                fullWidth
                margin="dense"
                variant="outlined"
                value={queryString}
                placeholder="Search movies information..."
                onChange={(event) => {setQueryString(event.target.value)}}
                onKeyPress={(event) => {
                  if(event.key === "Enter"){
                    event.preventDefault();
                    if(lastPageReached){
                      setLastPageReached(false)
                    }
                    handleSearch()
                  }
                }}
                InputProps={{
                  style: {
                    borderRadius: "25px",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        aria-label="toggle password visibility" 
                        onClick={() => {
                            if(lastPageReached){
                              setLastPageReached(false)
                            }
                            handleSearch()
                          }
                        } 
                        onMouseDown={handleMouseDownPassword}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </div>
          <Button href="/search/advanced" style={{marginTop: "10px", marginBottom: "5px"}} color="secondary">
            Go to Advanced Search
          </Button>
          {
            !loading
            ?
            (
              SearchState.results
              ?
              (
                SearchState.results.results?.bindings?.length > 0 
                ?
                (
                  <div>
                    {
                      SearchState.results.results?.bindings?.map((item: any) => {
                        return (
                          <SingleMovieCard movie={item} key={Math.random()} />
                        )
                      })
                    }
                    <div>
                      {
                        page !== 1
                        ?
                        (
                          <Button onClick={handlePrevPage}>
                            Prev
                          </Button>
                        )
                        :
                        (
                          null
                        )
                      }
                      {
                        !lastPageReached
                        ?
                        (
                          <Button onClick={handleNextPage}>
                            Next
                          </Button>
                        )
                        :
                        (
                          null
                        )
                      }
                    </div>
                  </div>
                )
                :
                (
                  <div>
                    No movies match your query
                  </div>
                )
              )
              :
              (
                <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                  Your search results will appear here.
                </div>
              )
            )
            :
            (
              <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                <CircularProgress />
              </div>
            )
          }
        </Grid>
      </Grid>
      
    </Page>
  );
};

export default SearchResults;