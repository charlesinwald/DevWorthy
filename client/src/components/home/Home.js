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
        width: '100%'
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
        width: "auto"
    },
    drawerContainer: {
        overflow: 'auto',
    },
    tagBadge: {

    }
}));


const Home = ({
                  getCurrentProfile,
                  getPostsByTag,
                  getAllPosts,
                  auth: {user},
                  profile: {profile, loading},
              }) => {


    useEffect(() => {
        getCurrentProfile(user);
    }, [getCurrentProfile]);

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return loading && (profile === null) ? (
        <CircularProgress/>
    ) : (
        <Fragment>

            <Grid container spacing={3} className={classes.root}>
                <Grid direction="column"
                      sm={1}
                      container>
                    <Grid className={"grow-small"} item>
                        <Chip color="primary"
                              onClick={() => getPostsByTag("Controversial")}
                              clickable
                              label={"Controversial"}/>
                    </Grid>
                    <Grid className={"grow-small"} item>
                        <Chip color="primary"
                              onClick={() => getPostsByTag("Funny")}
                              clickable
                              label={"Funny"}/>
                    </Grid>
                    <Grid className={"grow-small"} item>
                        <Chip color="primary"
                              onClick={() => getPostsByTag("Wholesome")}
                              clickable
                              label={"Wholesome"}/>
                    </Grid>
                    <Grid className={"grow-small"} item>
                        <Chip color="primary"
                              onClick={() => getAllPosts()}
                              clickable
                              label={"All"}/>
                    </Grid>
                </Grid>
                <Feed/>
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
                     className={classes.fab}>
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
    profile: state.profile,
    getPostsByTag: getPostsByTag,
    getAllPosts: getAllPosts
});

export default connect(
mapStateToProps,
{getCurrentProfile,
    getAllPosts,
    getPostsByTag}
)(Home);
