import React, {useReducer} from "react";
import Slide from "@material-ui/core/Slide";
import {getAllPosts, updatePost} from "../../actions/post";
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

const Post = ({
                  getAllPosts,
                   updatePost,
                   auth: {user},
                   post: {post, loading},
                    props
              }
) => {
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
        updatePost(title, text, props.post._id);
        togglePostEditing();
        getAllPosts();
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
    getAllPosts: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
};
const mapStateToProps = (state, ownProps) => ({
    auth: state.auth,
    posts: state.post,
    props: ownProps
});
export default connect(mapStateToProps, {getAllPosts, updatePost})(Post);
