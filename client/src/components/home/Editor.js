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
    }
}));


function Dropzone(props) {
    return <div {...props.rootProps} className="dropzone">
        <PublishRoundedIcon color={"primary"} style={{ fontSize: 100, width: '100%' }}/>
        <input {...props.inputProps} />
        {
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
const Editor = ({
                    createPost,
                    getAllPosts,
                    auth: {user},
                    setOpen
                }) => {

    const classes = useStyles();
    Editor.titleText = React.createRef();
    Editor.bodyText = React.createRef();
    Editor.photo = React.createRef();
    const [files, setFiles] = useState([]);
    console.log(user);
    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles[0]);
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, [])
    const {getRootProps, getInputProps, isDragActive } = useDropzone({accept: 'image/*', onDrop})


    const photoPreview = files.map(file => (
        <div key={file.name}>
            <img
                src={file.preview}
                alt={file.name}/>
        </div>
    ));


    Editor.submitPost = function (setOpen) {
        console.log('submitPost reached');
        let title = this.titleText.current.value;
        let text = this.bodyText.current.value;
        let data = new FormData();
        data.append("title", title);
        data.append("text", text);
        console.dir(files);
        data.append("photo", files[0]);
        createPost(data);
        getAllPosts();
        setOpen(false);
    }
    return user === null ? (
        <CircularProgress/>
    ) : (<Grid item sm className={classes.root}>
        <Dropzone rootProps={getRootProps()} inputProps={getInputProps()} dragActive={isDragActive} multiple={false}/>
        {photoPreview}
        <TextField
            className={classes.titlearea}
            autoComplete='off'
            id="title"
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

const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps, {createPost, getAllPosts})(Editor);