import { makeStyles } from "@material-ui/core";
import NavBar from "../components/NavBar"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  content: {
    padding: "40px 50px",
    [theme.breakpoints.down("sm")]: {
      padding: "15px 15px"
    }
  },
}));

interface Props {
  children: any
}

const Page:React.FC<Props> = ({children}) => {

  const classes = useStyles();

  return (
    <div>
      <NavBar />
      <div className={classes.content}>
        {children}
      </div>
    </div>
  )
}

export default Page;