import React from 'react';
import axios from 'axios';
import Page from "../../layouts/Page"
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import AppStateContext from '../../ContextApi/AppStateContext';
import DispatchContext from '../../ContextApi/DispatchContext';
import CircularProgress from "@material-ui/core/CircularProgress";

import MenuItem from '@material-ui/core/MenuItem';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import SingleMovieCard from '../../components/SingleMovieCard';

interface Props {

}

const sortOptions = [
  {value: 'title', title: "Title"},
  {value: 'year', title: "Year"},
]

const sortDirectionsOptions = [
  {value: 'ASC', title: "Ascending"},
  {value: 'DESC', title: "Descending"},
]

const AdvancedSearch: React.FC<Props> = (props) => {

  const { SearchState } = React.useContext(AppStateContext);
  const { SearchDispatcher } = React.useContext(DispatchContext);
  
  const [loading, setLoading] = React.useState(false)
  const [queryValues, setQueryValues] = React.useState({ ...SearchState.query })

  const handleChange = (name: string) => (event: any) => {
    setQueryValues({...queryValues, [name]: event.target.value})
  }

  const handleDateChange = (name: string) => (event: any) => {
    setQueryValues({...queryValues, [name]: event.getFullYear()})
  }

  const onSubmit = async () => {
    setLoading(true)
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
        FILTER( REGEX(STR(?label),"${queryValues.keywords || ""}") )
        FILTER(LANGMATCHES(LANG(?label), "en"))
        FILTER(LANGMATCHES(LANG(?producer_name), "en"))
        FILTER(LANGMATCHES(LANG(?abstract), "en"))
      }
      ORDER BY ${queryValues.sort_direction || "ASC"} (?${queryValues.sort_by || 'label'})
      LIMIT ${queryValues.limit || 25}
    `
    await axios.get(`${process.env.REACT_APP_DBPEDIA_URL}/sparql/?query=${encodeURIComponent(query)}`, {headers: {Accept: 'application/json'}})
      .then(response => {
        SearchDispatcher({type: "addSearchQuery", payload: {...queryValues}});
        SearchDispatcher({type: "addSearchResults", payload: response.data});
      })
      .catch(error => {
        console.log("<<<<<<<<<< Error: ", error);
      });
    setLoading(false)
  }

  return (
    <Page>
      <Grid container style={{height: "calc(100vh - 150px)"}}>
        <Grid item xs={12} sm={5} md={4} lg={3} style={{height: "100%", padding: "0 15px", borderRight: "1px solid #eaeaea"}}>
          <Typography variant="h5" gutterBottom>Semantic Web Movie Search</Typography>
          <FormControl fullWidth >
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              label="Keywords"
              variant="outlined"
              placeholder="Enter movie title..."
              onChange={handleChange("keywords")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </FormControl>
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <FormControl style={{boxSizing: 'border-box', width: "50%"}}>
                <KeyboardDatePicker
                  id="date_from"
                  name="date_from"
                  views={['year']}
                  margin="dense"
                  label="Date from"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  value={queryValues?.date_from || null}
                  onChange={handleDateChange('date_from')}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </FormControl>
              <FormControl style={{boxSizing: 'border-box', width: "50%"}}>
                <KeyboardDatePicker
                  id="date_to"
                  name="date_to"
                  views={['year']}
                  margin="dense"
                  label="Date to"
                  inputVariant="outlined"
                  format="dd/MM/yyyy"
                  value={queryValues?.date_to || null}
                  onChange={handleDateChange('date_to')}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </FormControl>
            </MuiPickersUtilsProvider>
          </div>
          <FormControl fullWidth >
            <TextField
              autoFocus
              fullWidth
              label="Genre"
              margin="dense"
              variant="outlined"
              placeholder="Genre"
              onChange={handleChange("genre")}
            />
          </FormControl>
          <div>
            <FormControl fullWidth>
              <TextField
                select
                autoFocus
                fullWidth
                margin="dense"
                label="Sort By"
                variant="outlined"
                placeholder="Sort By"
                style={{textAlign: "start"}}
                onChange={handleChange("sort_by")}
                value={queryValues?.sort_by || sortOptions[0].value}
              >
                {
                  sortOptions.map(item => {
                    return <MenuItem key={item.value} value={item.value}>{item.title}</MenuItem>
                  })
                }
              </TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                select
                autoFocus
                fullWidth
                margin="dense"
                label="Sort Direction"
                variant="outlined"
                placeholder="Sort Direction"
                style={{textAlign: "start"}}
                onChange={handleChange("sort_direction")}
                value={queryValues?.sort_direction || sortDirectionsOptions[0].value}
              >
                {
                  sortDirectionsOptions.map(item => {
                    return <MenuItem key={item.value} value={item.value}>{item.title}</MenuItem>
                  })
                }
              </TextField>
            </FormControl>
            <FormControl fullWidth>
              <TextField
                select
                autoFocus
                fullWidth
                margin="dense"
                label="Limit"
                variant="outlined"
                placeholder="Limit"
                style={{textAlign: "start"}}
                onChange={handleChange("limit")}
                value={queryValues?.limit || 25}
              >
                {
                  [25, 50, 75].map(item => {
                    return <MenuItem key={item} value={item}>{item}</MenuItem>
                  })
                }
              </TextField>
            </FormControl>
          </div>
          <Button
            fullWidth
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={onSubmit}
            style={{marginTop: "20px"}}
          >
            {!loading ? "Submit" : <CircularProgress size={22} style={{color: "#FFF"}} />}
          </Button>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={9} style={{height: "100%"}}>
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
              Query results will appear here!
            </div>
          )
        }
        </Grid>
      </Grid>
    </Page>
  )
}

export default AdvancedSearch