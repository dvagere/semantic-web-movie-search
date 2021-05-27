import React from 'react';
import axios from 'axios';
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import AppStateContext from '../../ContextApi/AppStateContext';
import DispatchContext from '../../ContextApi/DispatchContext';
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";

import Page from '../../layouts/Page';

interface Props {

}

const SearchResults:React.FC<Props> = (props) => {

  const [ queryString, setQueryString ] = React.useState<string>("");

  const { SearchState } = React.useContext(AppStateContext)
  const { SearchDispatcher } = React.useContext(DispatchContext)

  console.log("Search: ", SearchState);
  const handleSearch = async () => {

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
      LIMIT 5
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
      <div style={{maxWidth: "600px", width: "100%"}}>
        <FormControl fullWidth >
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            placeholder="Search movies information..."
            onChange={(event) => {setQueryString(event.target.value)}}
            InputProps={{
              style: {
                borderRadius: "35px",
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
    </Page>
  );
};

export default SearchResults;