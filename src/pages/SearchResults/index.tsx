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

interface Props {

}

const SearchResults:React.FC<Props> = (props) => {

  
  const { SearchState } = React.useContext(AppStateContext)
  const { SearchDispatcher } = React.useContext(DispatchContext)
  
  const [ queryString, setQueryString ] = React.useState<string>(SearchState.query?.keywords ? SearchState.query.keywords : "");

  const handleSearch = async () => {

    SearchDispatcher({type: "addSearchResults", payload: null});

    const query = `PREFIX dbpediaOnto: <http://dbpedia.org/ontology/>
      PREFIX dbo: <http://dbpedia.org/ontology/>
      PREFIX dbp: <http://dbpedia.org/ontology/>
      PREFIX dbt: <http://dbpedia.org/ontology/>
      SELECT DISTINCT ?label, ?abstract, ?thumbnail, ?runtime, ?producer, ?producer_name, ?writer
      WHERE {
        {
          ?x rdf:type dbpediaOnto:Film.
          ?x rdfs:label ?label.
          ?x dbo:abstract ?abstract;
              dbo:thumbnail ?thumbnail;
              dbo:runtime ?runtime;
              dbo:producer ?producer;
              dbp:writer ?writer.
          ?producer rdfs:label ?producer_name.
        }

        UNION
        {
          ?x rdf:type dbpediaOnto:Movie.
          ?x rdfs:label ?label.
          ?x dbo:abstract ?abstract;
              dbo:thumbnail ?thumbnail;
              dbo:runtime ?runtime;
              dbo:producer ?producer;
              dbp:writer ?writer.
          ?producer rdfs:label ?producer_name.
        }
        FILTER( REGEX(STR(?label),"${queryString}") )
        FILTER(LANGMATCHES(LANG(?label), "en"))
        FILTER(LANGMATCHES(LANG(?producer_name), "en"))
        FILTER(LANGMATCHES(LANG(?abstract), "en"))
      }
      LIMIT 20
    `
    await axios.get(`${process.env.REACT_APP_DBPEDIA_URL}/sparql/?query=${encodeURIComponent(query)}`, {headers: {Accept: 'application/json'}})
      .then(response => {
        SearchDispatcher({type: "addSearchQuery", payload: {keywords: queryString}});
        SearchDispatcher({type: "addSearchResults", payload: response.data});
      })
      .catch(error => {
        console.log("<<<<<<<<<< Error: ", error);
      });
  }

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
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
                    handleSearch()
                  }
                }}
                InputProps={{
                  style: {
                    borderRadius: "25px",
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" aria-label="toggle password visibility" onClick={handleSearch} onMouseDown={handleMouseDownPassword}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </div>
          <Button href="/search/advanced" style={{marginTop: "10px", marginBottom: "5px"}} color="secondary">
            Advanced Search
          </Button>
          {
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