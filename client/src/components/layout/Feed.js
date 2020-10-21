import Grid from "@material-ui/core/Grid";
import {GridList, GridListTile, CircularProgress} from '@material-ui/core';
import PropTypes from "prop-types";
import React, {BaseSyntheticEvent as e, useEffect, useReducer} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {getAllPosts, updatePost} from "../../actions/post";
import Spinner from "./Spinner";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import Toolbar from "@material-ui/core/Toolbar";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {Menu} from "@material-ui/icons";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        marginTop: '2rem',
        width: '100%',
        maxWidth: "1100px",
        padding: '.5rem',
    },
    photoTile: {
        height: theme.spacing(15),
        cursor: "pointer"
    },
    photoTileInner: {
        height: "100%"
    },
    middlePane: {
        width: '100%',
        maxWidth: "1100px",
        margin: "auto",
        overflowY: 'scroll',
        // maxHeight: '70vh'
    },
    '@global': {
        '*::-webkit-scrollbar': {
            display: 'none'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            display: 'none'
        }
    },
    loading: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "5rem",
        color: theme.palette.primary.main
    },
    media: {
        height: 0,
        // maxWidth: "60%",
        paddingTop: '56.25%', // 16:9
    },
    card: {
        maxWidth: "720px",
        width: "100%",
        height: "auto"
        // margin: "auto"
    },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function reducer(state, action) {
    switch (action.type) {
        case 'open':
            return {open: !state.open, editing: state.editing};
        case 'edit':
            return {editing: !state.editing, open: true};
        default:
            throw new Error();
    }
}

const initialState = {open: false, editing: false};

function Post(props) {
    const [state, dispatch] = useReducer(reducer, initialState);

    Post.titleText = React.createRef();
    Post.bodyText = React.createRef();

    const handleDialogOpen = () => {
        dispatch({type: 'open'});
    };

    const handleDialogClose = (e) => {
        e.stopPropagation();
        dispatch({type: 'open'});
    };

    const togglePostEditing = () => {
        dispatch({type: 'edit'});
    };

    Post.submitUpdate = function () {
        let title = this.titleText.current.value;
        let text = this.bodyText.current.value;
        console.log(title, text);
        props.updatePost(title, text, props.post._id);
        togglePostEditing();
    }

    return <GridListTile className={props.classes.photoTileInner}>

        <img alt={props.post.title} src={props.post.photo} onClick={handleDialogOpen}/>
        <GridListTileBar
            titlePosition="top"
            onClick={handleDialogOpen}
            title={props.post.title}
            subtitle={<span>{props.post.description}</span>}
        />
        <Dialog fullScreen open={state.open} onClose={handleDialogClose} TransitionComponent={Transition}>
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleDialogClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>
                {state.editing ?
                    <TextField
                        autoComplete='off'
                        id="title"
                        inputRef={Post.titleText}
                        placeholder={props.post.title}
                        variant="outlined"
                    /> :
                    <Typography>
                        {props.post.title}
                    </Typography>}
            </Toolbar>
            <Paper className={props.classes.card}>
                <img src={props.post.photo}/>
                {props.editable && <a onClick={togglePostEditing}>{state.editing ? 'Cancel' : 'Edit'}</a>}
                {state.editing ? <TextField
                        id="textarea"
                        inputRef={Post.bodyText}
                        placeholder="Description"
                        multiline
                        variant="outlined"
                    /> :
                    <Typography>
                        {props.post.text}
                    </Typography>}
                {state.editing && <Button onClick={() => Post.submitUpdate()}>Submit</Button>}
            </Paper>

        </Dialog>
    </GridListTile>
}

Post.propTypes = {
    post: PropTypes.any,
    classes: PropTypes.any,
    onClick: PropTypes.func,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onClick1: PropTypes.func
};
const Feed = ({
                  getAllPosts,
                  updatePost,
                  auth: {user},
                  posts: {posts, loading}
              }
) => {

    useEffect(() => {
        getAllPosts()
    }, [getAllPosts]);


    const classes = useStyles();
    return loading || (posts === null) ? (
        <CircularProgress className={classes.loading} size={"5rem"} thickness={5}/>
    ) : (<Grid item sm className={classes.middlePane}>
        <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {posts && posts.map((post) => {
                if (post.photo) {
                    console.log(post.photo, post._id)
                    console.log(post.user, user._id)
                    //Users can only edit/delete their own posts
                    //This is also checked on the backend, but we use this so we don't show the buttons
                    //for actions they can't perform
                    let editable = (post.user === user._id)
                    return (
                        <GridListTile cols={post.cols || 1} rows={2} className={classes.photoTile}><Post key={post._id}
                                                                                                         post={post}
                                                                                                         classes={classes}
                                                                                                         editable={editable}
                                                                                                         updatePost={updatePost}
                                                                                                            />
                        </GridListTile>
                    );
                }
            })}
        </GridList>
    </Grid>);
}

Feed.propTypes = {
    getAllPosts: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    posts: state.post,
});
export default connect(mapStateToProps, {getAllPosts, updatePost})(Feed);