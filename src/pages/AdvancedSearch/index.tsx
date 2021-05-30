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
import { generateQuery } from '../../utils/query';

interface Props {

}

const sortOptions = [
  {value: 'label', title: "Label"},
  {value: 'releaseDate', title: "Release Date"},
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

  const [page, setPage] = React.useState(1);
  const [lastPageReached, setLastPageReached] = React.useState(false);

  const handleChange = (name: string) => (event: any) => {
    setQueryValues({...queryValues, [name]: event.target.value})
  }

  const handleDateChange = (name: string) => (event: any) => {
    setQueryValues({...queryValues, [name]: event})
  }

  console.log(">>>", SearchState)

  const onSubmit = async (offsetting?: number) => {
    setLoading(true)

    let offset = 0;

    if(offsetting){
      let currPage = page;
      if(offsetting < 0){
        currPage = currPage - 1
      }

      offset = currPage * (SearchState.results?.results?.bindings ? SearchState.results?.results?.bindings.length : 0)
    }

    const qVals = {
      ...queryValues,
    }

    if(queryValues.date_from){
      qVals['date_from'] = `${queryValues.date_from.getFullYear()}-01-01`;
    }

    if(queryValues.date_to){
      qVals['date_to'] = `${queryValues.date_to.getFullYear()}-01-01`;
    }

    if(offsetting){
      qVals["offset"] = offset
    }

    const query = generateQuery(qVals)

    await axios.get(`${process.env.REACT_APP_DBPEDIA_URL}/sparql/?query=${encodeURIComponent(query)}`, {headers: {Accept: 'application/json'}})
      .then(response => {
        SearchDispatcher({type: "addSearchQuery", payload: {...queryValues}});
        SearchDispatcher({type: "addSearchResults", payload: response.data});
        if(queryValues.limit){
          if(response.data.results?.bindings?.length < queryValues.limit){
            setLastPageReached(true);
          } else {
            setLastPageReached(false);
          }
        } else {
          if(response.data.results?.bindings?.length < 25){
            setLastPageReached(true);
          } else {
            setLastPageReached(false)
          }
        }
      })
      .catch(error => {
        console.log("<<<<<<<<<< Error: ", error);
      });
    setLoading(false)
  }

  const handleNextPage = async () => {
    await onSubmit(1)
    setPage(page + 1);
  }

  const handlePrevPage = async () => {
    await onSubmit(-1)
    setPage(page - 1);
  }

  return (
    <Page>
      <Grid container style={{height: "calc(100vh - 150px)"}}>
        <Grid item xs={12} sm={5} md={4} lg={3} style={{height: "100%", padding: "0 15px", borderRight: "1px solid #eaeaea"}}>
          <Typography variant="h5" gutterBottom>Semantic Web Movie Search</Typography>
          <FormControl fullWidth style={{margin: "10px 0px"}} >
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
          <div style={{margin: "10px 0px"}}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <FormControl style={{boxSizing: 'border-box', width: "50%"}}>
                <KeyboardDatePicker
                  id="date_from"
                  name="date_from"
                  views={['year']}
                  clearable
                  margin="dense"
                  label="From"
                  inputVariant="outlined"
                  format="yyyy"
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
                  clearable
                  name="date_to"
                  views={['year']}
                  margin="dense"
                  label="To"
                  inputVariant="outlined"
                  format="yyyy"
                  value={queryValues?.date_to || null}
                  onChange={handleDateChange('date_to')}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </FormControl>
            </MuiPickersUtilsProvider>
          </div>
          {/* <FormControl fullWidth >
            <TextField
              autoFocus
              fullWidth
              label="Genre"
              margin="dense"
              variant="outlined"
              placeholder="Genre"
              onChange={handleChange("genre")}
            />
          </FormControl> */}
          <div>
            <FormControl fullWidth style={{margin: "10px 0px"}}>
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
            <FormControl fullWidth style={{margin: "10px 0px"}}>
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
            <FormControl fullWidth style={{margin: "10px 0px"}}>
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
            onClick={() => {onSubmit()}}
            style={{marginTop: "20px"}}
          >
            {!loading ? "Submit" : <CircularProgress size={22} style={{color: "#FFF"}} />}
          </Button>
        </Grid>
        <Grid item xs={12} sm={7} md={8} lg={9} style={{height: "100%"}}>
        {
          loading
          ?
          (
            <div style={{display: "flex", justifyContent: "center", width: "100%", height: "60vh", alignItems: "center"}}>
              <CircularProgress />
            </div>
          )
          :
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
                Query results will appear here!
              </div>
            )
          )
        }
        </Grid>
      </Grid>
    </Page>
  )
}

export default AdvancedSearch