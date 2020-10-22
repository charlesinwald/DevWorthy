import Grid from "@material-ui/core/Grid";
import React, {useEffect, useCallback, useState, useMemo} from "react";
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {createPost, getAllPosts} from "../../actions/post";
import {useDropzone} from 'react-dropzone'
import CircularProgress from "@material-ui/core/CircularProgress";
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles((theme) => ({
    //For styling Grid layout
    root: {
        color: '#cc'
    },
    textarea: {
        width: '65%',
        marginTop: '1rem'
    },
    titlearea: {
        marginTop: '1rem',
        width: '50%',
    },
    paper: {
        padding: '2rem',
    },
    submitButton: {
        margin: '1rem',
        color: "white",
        float:'right',
    },
    //Image Preview
    preview: {
        
    }
}));

//For file uploads (click or drag and drop)
function Dropzone(props) {
    return <div {...props.rootProps} className="dropzone">
        <PublishRoundedIcon color={"primary"} style={{ fontSize: 100, width: '100%' }}/>
        <input {...props.inputProps} />
        {
            //dragActive is true when they are hovering a file over the box
            props.dragActive ?
                <p style={{color: "#00525E", textAlign: "center"}}>Drop photo here...</p> :
                <p style={{color: "#00525E", textAlign: "center"}}>Drag a photo here, or click to select one</p>
        }
    </div>;
}

Dropzone.propTypes = {
    rootProps: PropTypes.any,
    inputProps: PropTypes.any,
    dragActive: PropTypes.bool
};

//Handles File Upload, writing title, description, and submission
const Editor = ({
                    //Redux actions are specified
                    createPost,
                    //So posts list is updated once post is successfully submitted
                    getAllPosts,
                    //We need some information about the user i.e name
                    auth: {user},
                    //Opening and closing dialog
                    setOpen
                }) => {
    //For styling
    const classes = useStyles();
    //For referencing the fields of the "form", i.e retrieving current values
    Editor.titleText = React.createRef();
    Editor.bodyText = React.createRef();
    Editor.photo = React.createRef();
    //File is initially empty, setFiles will fill it
    const [files, setFiles] = useState([]);
    //Specifies functionality of dragging and dropping a file, or clicking and uploading
    const onDrop = useCallback(acceptedFiles => {
        //Object URL is necessary for upload
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, [])
    //We specify that only images are allowed to be updated
    const {getRootProps, getInputProps, isDragActive } = useDropzone({accept: 'image/*', onDrop})

    //Preview image
    const photoPreview = files.map(file => (
        <div key={file.name}>
            <img
                className={classes.preview}
                src={file.preview}
                alt={file.name}/>
        </div>
    ));

    //We pass in setOpen so we can close dialog afterwards
    Editor.submitPost = function (setOpen) {
        //We utilize the refs we defined earlier to retrieve current values
        let title = this.titleText.current.value;
        let text = this.bodyText.current.value;
        //Backend expects a FormData object, with title, text and photo
        let data = new FormData();
        data.append("title", title);
        data.append("text", text);
        data.append("photo", files[0]);
        //Call action to perform POST request with data
        createPost(data);
        //Refresh posts
        getAllPosts();
        //Close dialog
        setOpen(false);
    }
    //When loading, display loading icon
    return user === null ? (
        <CircularProgress/>
    ) : (<Grid item sm className={classes.root}>
        {/*File Upload*/}
        <Dropzone rootProps={getRootProps()} inputProps={getInputProps()} dragActive={isDragActive} multiple={false}/>
        {photoPreview}
        <TextField
            className={classes.titlearea}
            autoComplete='off'
            id="title"
            // So we can retrieve value
            inputRef={Editor.titleText}
            label="Post Title"
            placeholder="<Post Title>"
            variant="outlined"
        />
        <TextField
            className={classes.textarea}
            id="textarea"
            inputRef={Editor.bodyText}
            label="Description"
            placeholder="Description"
            multiline
            variant="outlined"
        />
        {/*Display full name for accountability purposes*/}
        <Typography>Posting as {user.firstName + ' ' + user.lastName}</Typography>
        <Button className={classes.submitButton}
                // variant="outlined"
                variant="contained"
                color="primary"
                onClick={() => Editor.submitPost(setOpen)}>
            Submit
        </Button>
    </Grid>);
};

Editor.propTypes = {
    auth: PropTypes.object.isRequired,
    createPost: PropTypes.func.isRequired,

};
//For accessing Redux Store indirectly
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps, {createPost, getAllPosts})(Editor);