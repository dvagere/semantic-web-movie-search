import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import React from "react";

interface Props {
  movie: any;
}

const useStyles = makeStyles((theme) => ({
  listitem: {
    borderBottom: '1px solid #eaeaea',
    padding: '5px',
    cursor: "pointer",
    transition: "0.5s",
    listStyle: 'none',
    alignItems: 'unset',
    "&:hover": {
      backgroundColor: "#F1F2F3 !important",
      boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)"
    },
  },
  avatar: {
    width: "4.5rem",
    height: "4.5rem"
  },
  listItemAvatar: {
    margin: "10px"
  },
  textContainer: {
    margin: "10px"
  },
  description: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
  }
}));

const SingleMovieCard: React.FC<Props> = ({movie}) => {

  const classes = useStyles();

  return (
    <React.Fragment>
      <ListItem alignItems="center" className={classes.listitem}>
        <ListItemAvatar className={classes.listItemAvatar}>
          <Avatar className={classes.avatar} src={movie.thumbnail.value} variant="rounded" />
        </ListItemAvatar>
        <ListItemText
          className={classes.textContainer}
          primary={
            <React.Fragment>
              <Typography
                component="span"
                variant="h5"
              >
                {movie.label.value}
              </Typography>
            </React.Fragment>
          }
          secondary={
            <React.Fragment>
              <Typography
                variant="body2"
                component="span"
                color="textPrimary"
                className={classes.description}
              >
                {movie.abstract.value}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </React.Fragment>
  );
};

export default SingleMovieCard;