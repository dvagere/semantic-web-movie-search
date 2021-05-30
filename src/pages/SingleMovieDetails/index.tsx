import { Avatar, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import React from 'react'
import AppStateContext from '../../ContextApi/AppStateContext';
import Page from '../../layouts/Page';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "8rem",
    height: "8rem"
  },
}));
interface Props {

}

const SingleMovieDetails: React.FC<Props> = (props) => {

  const classes = useStyles();

  const { SearchState } = React.useContext(AppStateContext);

  console.log("SearchState: ", SearchState)
  const movie = SearchState.movie;

  return (
    <Page>
      {
        !movie
        ?
        (

          <div style={{display: "flex", justifyContent: "center", width: "100%", height: "60vh", alignItems: "center"}}>
            <CircularProgress />
          </div>
        )
        :
        (
          <div style={{display: "flex", flexDirection: "column", width: "60%", alignItems: "center"}}>
            <Avatar className={classes.avatar} src={movie.thumbnail.value} variant="rounded" />
            <Typography
              component="span"
              variant="h6"
            >
              {movie.label.value}
            </Typography>
            <Typography
              variant="body1"
              component="span"
              color="textSecondary"
            >
              {movie.releaseDate.value}
            </Typography>
            <Typography
              variant="body1"
              component="span"
              color="textSecondary"
            >
              {movie.runtime.value}
            </Typography>
            <Typography
              variant="body1"
              component="span"
              color="textSecondary"
            >
              {movie.producer_name.value}
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="textSecondary"
            >
              {movie.writer.value}
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="textPrimary"
            >
              {movie.abstract.value}
            </Typography>
          </div>
        )
      }
    </Page>
  )
}

export default SingleMovieDetails