import axios from 'axios';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/SearchOutlined";

interface Props {

}

const Home:React.FC<Props> = (props) => {

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
        FILTER( REGEX(STR(?label),"Love") )
        FILTER(LANGMATCHES(LANG(?label), "en"))
        FILTER(LANGMATCHES(LANG(?producer_name), "en"))
        FILTER(LANGMATCHES(LANG(?abstract), "en"))
      }
      LIMIT 5
    `
    await axios.get(`${process.env.REACT_APP_DBPEDIA_URL}/sparql/?query=${encodeURIComponent(query)}`, {headers: {Accept: 'application/json'}})
    .then(response => {
      console.log(">>>>>>>>>> Response: ", response);
    })
    .catch(error => {
      console.log("<<<<<<<<<< Error: ", error);
    });
  }

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%"}}>
      <Typography variant="h4" gutterBottom>Semantic Web Movie Search</Typography>
      <div style={{maxWidth: "600px", width: "100%"}}>
        <FormControl fullWidth >
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            placeholder="Search movies information..."
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
        color="primary"
        // variant="outlined"
        style={{marginTop: "10px"}}
      >
        Advanced Search
      </Button>
    </div>
  );
};

export default Home;