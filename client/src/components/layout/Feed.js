import Grid from "@material-ui/core/Grid";
import {CircularProgress, GridList, GridListTile} from '@material-ui/core';
import PropTypes from "prop-types";
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {getAllPosts, updatePost} from "../../actions/post";
import Post from "../layout/Post";

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
        // maxWidth: "720px",
        // width: "100%",
        height: "auto",
        margin: "auto",
        padding: "2rem"
    },
    score: {
        color: "white",
        // marginRight: "1rem",
        display: "inline"
    },
    upvote: {
        display: "inline",
        color: "white",
    },
    downvote: {
        display: "inline",
        color: "white",
    }
}));

const Feed  = ({
                  getAllPosts,
                  updatePost,
                  auth: {user},
                  //For accessing posts from the Redux store
                  posts: {posts, loading},
              },
) => {

    useEffect(() => {
        getAllPosts()
    }, [getAllPosts]);


    const classes = useStyles();
    return loading || (posts === null) ? (
        <CircularProgress className={classes.loading} size={"5rem"} thickness={5}/>
    ) : (<Grid item sm className={classes.middlePane}>
        <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {/*If we have the posts, for each post, determine if editable, display photo, make clickable, etc*/}
            {posts && posts.map((post) => {
                if (post.photo) {
                    console.log(post.photo, post._id)
                    console.log(post.user, user._id)
                    //Users can only edit/delete their own posts
                    //This is also checked on the backend, but we use this so we don't show the buttons
                    //for actions they can't perform
                    let editable = (post.user === user._id)
                    return (
                        <GridListTile cols={post.cols || 1} rows={2} className={classes.photoTile}><Post
                            //key={post._id}
                                                                                                         post={post}
                                                                                                         classes={classes}
                                                                                                         editable={editable}
                                                                                                         // updatePost={updatePost}
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