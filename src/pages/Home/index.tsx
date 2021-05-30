import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';

import Page from '../../layouts/Page';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import DispatchContext from '../../ContextApi/DispatchContext';
import { generateQuery } from '../../utils/query';

interface Props {

}

const Home:React.FC<Props> = (props) => {

  const history = useHistory();
  const [ queryString, setQueryString ] = React.useState<string>("");

  const { SearchDispatcher } = React.useContext(DispatchContext)

  const handleSearch = () => {

    SearchDispatcher({type: "addSearchResults", payload: null});
    SearchDispatcher({type: "addSearchQuery", payload: {keywords: queryString}});

    const query = generateQuery({keywords: queryString});

    axios.get(`${process.env.REACT_APP_DBPEDIA_URL}/sparql/?query=${encodeURIComponent(query)}`, {headers: {Accept: 'application/json'}})
      .then(response => {
        SearchDispatcher({type: "addSearchResults", payload: response.data});
        SearchDispatcher({type: "addSearchQuery", payload: {keywords: queryString}});
      })
      .catch(error => {
        console.log("<<<<<<<<<< Error: ", error);
      });
    history.push(`/search?query=${encodeURIComponent(query)}`)
  }

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  return (
    <Page>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%"}}>
        <Typography variant="h4" gutterBottom>Semantic Web Movie Search</Typography>
        <div style={{maxWidth: "600px", width: "100%"}}>
          <FormControl fullWidth >
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              variant="outlined"
              placeholder="Search movies information..."
              onChange={(event) => {setQueryString(event.target.value)}}
              onKeyPress={(ev) => {
                if(ev.key === "Enter"){
                  ev.preventDefault()
                  handleSearch()
                }
              }}
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
        <Button
          href="/search/advanced"
          color="secondary"
          style={{marginTop: "10px"}}
        >
          Advanced Search
        </Button>
      </div>
    </Page>
  );
};

export default Home;