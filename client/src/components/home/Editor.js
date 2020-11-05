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

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';

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
    formControl: {
        //margin: theme.spacing(1),
        //minWidth: 120,
        width: '65%',
        marginTop: '1rem'
      },
      
    //Image Preview
    preview: {
        
    }
}));

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  };
  
  const thumb = {
    //display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
  };
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'inline',
    width: '90px',
    height: '90px'
  };
  

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
    dragActive: PropTypes.bool,
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
    Editor.category = React.createRef();
    Editor.thumbnail = React.createRef();
    //File is initially empty, setFiles will fill it
    const [files, setFiles] = useState([]);
    const [selectedCategoryValue,setCategory] = useState([]);
    
    const categories = ['Funny','Info','Controversial','Random'];
    
    
    //updates the category values 
    const handleCategoryChange = (event) => {
      setCategory(event.target.value);
    }
    //Specifies functionality of dragging and dropping a file, or clicking and uploading
    const onDrop = useCallback(acceptedFiles => {
        //Object URL is necessary for upload
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
    }, [])
  
    //We specify that only images are allowed to be updated
    const {getRootProps, getInputProps, isDragActive} = useDropzone({accept: 'image/*', onDrop: acceptedFiles =>  {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
          })));
        }
    })

     //Preview image
    const photoPreview = files.map(file => (
        
        <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
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
        for(let i=0; i<selectedCategoryValue.length;i+=1)
        {
          data.append("tags",selectedCategoryValue[i]);
        }
        //TODO append data as "tags", as an array i.e [Funny] or [Funny, Controversial]
        //Call action to perform POST request with data
        createPost(data);
        //Refresh posts
        getAllPosts();
        //Close dialog
        setOpen(false);
    }

    
    //When loading, display loading icon
    //console.log(photoPreview.files);
    return user === null ? (
        <CircularProgress/>
    ) : (<Grid item sm className={classes.root}>
        {/*File Upload*/}
        <Dropzone rootProps={getRootProps()} inputProps={getInputProps()} dragActive={isDragActive} multiple={false}/>
        <aside style={thumbsContainer}>
        {photoPreview}
      </aside>
      
        
        
       
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
       
        <FormControl variant="outlined" className={classes.formControl}  >
           <InputLabel id="demo-simple-select-outlined-label"  placeholder="<Category>">Category</InputLabel>
           <Select
             labelId="demo-simple-select-outlined-label"
             id="demo-simple-select-outlined"
             label="Category"
             multiple
             value= {selectedCategoryValue}
             onChange={handleCategoryChange}
             >
          {categories.map((category, index) =>
            <MenuItem key={category} value={category} primaryText={category[index]}>{category}</MenuItem>
          )}
        </Select>
      </FormControl>
        
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


//For accessing Redux Store indirectly
const mapStateToProps = state => ({
    auth: state.auth,
});
export default connect(mapStateToProps, {createPost, getAllPosts})(Editor);