import React, {useReducer} from "react";
import Slide from "@material-ui/core/Slide";
import {deletePost, getAllPosts, updatePost, vote} from "../../actions/post";
import {GridListTile} from "@material-ui/core";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Dialog from "@material-ui/core/Dialog";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    image: {
        margin: "auto",
        maxWidth: "580px",
        maxHeight: "75vh",
        width: "100%",
    },
    editTitle: {
        display: "block"
    },
    editDescription: {
        display: "block"
    },
    icons: {
        cursor: "pointer"
    }
}));

function reducer(state, action) {
    switch (action.type) {
        case 'open':
            return {open: !state.open, editing: state.editing};
        case 'edit':
            return {editing: !state.editing, open: true};
        case 'delete':
            return {editing: false, open: false, deleting: true};
        default:
            throw new Error();
    }
}

const initialState = {open: false, editing: false, deleting: false};

const Post = ({
                  getAllPosts,
                  deletePost,
    //So we can update the post
                   updatePost,
                    vote,
                   auth: {user},
                   post: {post, loading},
                    props
              }
) => {
    //We use useReducer instead of useState, so we have fine grained control over the state of the
    //dialog being open and if the post is being edited
    const [state, dispatch] = useReducer(reducer, initialState);

    const classes = useStyles();
    //Pretty printed timestamp
    const prettyDate = moment(props.post.date).fromNow();

    //We want to be able to access the current values of the text fields
    Post.titleText = React.createRef();
    Post.bodyText = React.createRef();
    Post.bodyTextTypography = React.createRef();

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

    const handleDeletePost = () => {
        dispatch({type: 'delete'});
        deletePost(props.post)
        //Refresh the posts
        // getAllPosts();
    }

    const handleVote = (e, type) => {
            e.stopPropagation()
            vote(props.post, type)
    }

    Post.submitUpdate = function () {
        //Retrieve the values of the title/text fields
        let title = this.titleText.current.value;
        let text = this.bodyText.current.value;
        console.log(title, text);
        //action to update the post
        updatePost(title, text, props.post);
        //We are no longer editing, change the state accordingly
        togglePostEditing();
        //Refresh the posts
        getAllPosts();
    }

    return <GridListTile className={props.classes.photoTileInner}>

        <img alt={props.post.title} src={props.post.photo} onClick={handleDialogOpen}/>
        <GridListTileBar
            titlePosition="top"
            onClick={handleDialogOpen}
            title={<b>{props.post.title}</b>}
            subtitle={<span>{props.post.firstName + ' ' + props.post.lastName}</span>}
            actionIcon={
                <div>
                    <IconButton aria-label={"Downvote"} className={props.classes.downvote} onClick={(e) => handleVote(e, "down")}>
                        <ThumbDownAltIcon className={"grow"}/>
                    </IconButton>
                    <Typography variant="h6" className={props.classes.score}>{props.post.votes}</Typography>
                    <IconButton aria-label={"Upvote"} className={props.classes.upvote} onClick={(e) => handleVote(e, "up")}>
                        <ThumbUpAltIcon className={"grow"}/>
                    </IconButton>
                </div>
            }
        />
        {/*This is what shows when the post has been clicked on*/}
        <Dialog  open={state.open} onClose={handleDialogClose} TransitionComponent={Transition} >
            <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleDialogClose} aria-label="close">
                    <CloseIcon/>
                </IconButton>

            </Toolbar>
            <Paper className={props.classes.card}>
                {/*If editing, input field, otherwise just text*/}
                {state.editing ?
                    <TextField
                        className={classes.editTitle}
                        autoComplete='off'
                        id="title"
                        inputRef={Post.titleText}
                        placeholder={props.post.title}
                        variant="outlined"
                    /> :
                    <Typography>
                        {props.post.title}
                    </Typography>}
                <img src={props.post.photo} className={classes.image}/>
                <Typography sm>{prettyDate}</Typography>
                {props.editable && <a onClick={togglePostEditing}>{state.editing ? 'Cancel' : <EditIcon className={classes.icons}/>}</a>}
                {props.editable && <a onClick={handleDeletePost}><DeleteIcon className={classes.icons}/></a>}

                {/*If editing, input field, otherwise just text*/}
                {state.editing ? <TextField
                        id="textarea"
                        className={classes.editDescription}
                        inputRef={Post.bodyText}
                        placeholder="Description"
                        multiline
                        variant="outlined"
                    /> :
                    <Typography ref={Post.bodyTextTypography}>
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
    getAllPosts: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
};
const mapStateToProps = (state, ownProps) => ({
    auth: state.auth,
    posts: state.post,
    props: ownProps
});
export default connect(mapStateToProps, {getAllPosts, updatePost, deletePost, vote})(Post);
