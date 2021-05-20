import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/SearchOutlined";
import { Button } from "@material-ui/core";

interface Props {

}

const Home:React.FC<Props> = (props) => {

  const handleSearch = () => {

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