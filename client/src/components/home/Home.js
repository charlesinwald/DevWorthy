import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getCurrentProfile} from '../../actions/profile';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import {makeStyles} from "@material-ui/core/styles";
import Feed from "../layout/Feed";
import Editor from "./Editor";
import CircularProgress from "@material-ui/core/CircularProgress";
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import Chip from "@material-ui/core/Chip";
import {getAllPosts, getPostsByTag} from "../../actions/post";
import {isMobile} from 'react-device-detect';


const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: theme.palette.primary.contrastText
    },
    root: {
        margin: 'auto',
        width: '100%',
        height: '100%',
        padding: '.5rem',
        overflow: 'scroll'
    },
    middlePane: {
        margin: 'auto',
        width: '100%',
        paddingBottom: "5rem"
    },
    fab: {
        backgroundColor: theme.palette.primary.dark,
        position: 'absolute',
        bottom: theme.spacing(2),
        left: "50%"
        // right: theme.spacing(2),
    },
    closeButton: {
        cursor: "pointer",
        float: 'right',
        marginTop: '5px',
        color: theme.palette.primary.dark
    },
    tagsDrawer: {
        zIndex: 99999,
        position: "fixed"
    },
    drawerContainer: {
        overflow: 'auto',
    },
    filter: {
        fontSize: "large",
        fontWeight: "bolder"
    },

}));


const Home = ({
                  getPostsByTag,
                  getAllPosts,
                  post: {posts, loading, tag},
                  auth: {user},
              }) => {


    useEffect(() => {
        if (!tag) {
            getAllPosts(1);
        }
    }, [getAllPosts]);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    console.log(window.innerHeight);
    const tags = ["Funny", "Info", "Controversial", "Random"];
    const filterChips = tags.map(filter => {
        let selected = filter === tag;
        return selected ? <Grid className={"grow-small"} item>
            <Chip color="primary"
                  className={classes.filter}
                  onClick={() => getPostsByTag(filter)}
                  clickable
                  label={filter}/>
        </Grid>
            : <Grid className={"grow-small"} item>
            <Chip color="default"
                  variant="outlined"
                  className={classes.filter}
                  onClick={() => getPostsByTag(filter)}
                  clickable
                  label={filter}/>
        </Grid>
    })
    return loading && (posts === null) ? (
        <CircularProgress/>
    ) : (
        <Fragment>

            <Grid container spacing={3} className={classes.root}>
                <Grid direction={isMobile ? "row" : "column"}
                      className={classes.tagsDrawer}
                      sm={1}
                      container>
                    {filterChips}
                    <Grid className={"grow-small"} item>
                        <Chip color={(tag === 'All') ? "primary" : "default"}
                              variant={(tag === 'All') ? "default" : "outlined"}
                              className={classes.filter}
                              onClick={() => getAllPosts(1)}
                              clickable
                              label={"All"}/>
                    </Grid>
                </Grid>
                <Feed />
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                        New Post
                        <HighlightOffRoundedIcon fontSize={"large"} className={classes.closeButton}
                                                 onClick={() => handleClose()}/>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Editor open={open} setOpen={setOpen}/>
                    </DialogContent>

                </Dialog>
                <Fab color="primary" size="large" aria-label="add" variant={"extended"} onClick={handleClickOpen}
                     className={`${classes.fab} grow-small`}>
                    <AddIcon style={{marginRight: ".5rem"}}/>
                    New Post
                </Fab>
            </Grid>
        </Fragment>
);
};

Home.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    post: state.post,
    getPostsByTag: getPostsByTag,
    getAllPosts: getAllPosts
});

export default connect(
mapStateToProps,
{
    getAllPosts,
    getPostsByTag}
)(Home);
