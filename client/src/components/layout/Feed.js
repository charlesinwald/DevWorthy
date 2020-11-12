import Grid from "@material-ui/core/Grid";
import {CircularProgress, GridList, GridListTile} from '@material-ui/core';
import PropTypes from "prop-types";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {getAllPosts, getPostsByTag, updatePost} from "../../actions/post";
import Post from "../layout/Post";
import {isMobile} from 'react-device-detect';
import useInfiniteScroll from "react-infinite-scroll-hook";
import {useWindowSize} from "../../utils/windowSize";

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
        maxWidth: "1000px",
        margin: "auto",
        overflowY: 'scroll',
    },
    smallMiddlePane: {
      width: '100%',
      maxWidth: "60vw",
      margin: "auto",
      overflowY: 'scroll',
    },
    verySmallMiddlePane: {
      width: '100%',
      maxWidth: "40vw",
      margin: "auto",
      overflowY: 'scroll',
    },
    //Scrollbar
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
    //Loading Spinner
    loading: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "5rem",
        color: theme.palette.primary.main
    },
    score: {
        color: "white",
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

const Feed = ({
                  //For infinite scrolling
                  getPostsByTag,
                  //For determining which posts are editable
                  auth: {user},
                  //For accessing posts from the Redux store
                  posts: {posts, loading, tag},
              },
) => {

    const classes = useStyles();
    //Due to some odd nuance of the state machine. page must start at 2 for infinite scrolling to work
    //Not quite sure why this is...
    const [page, setPage] = useState(2);

  const windowSize = useWindowSize();


  //Single column feed on mobile
    let cols = (isMobile)  ? 1 : 3;
  //Some non mobile screens are still small
    let smallScreen = windowSize.width < 1200;
    let verySmallScreen = windowSize.width < 720;
    if (smallScreen) {
      cols = 2;
      if (verySmallScreen) {
        cols = 1;
      }
    }
    const nextPage = () => {
        //load more posts
        setPage(page + 1);
        tag ? getPostsByTag(tag, page) : getPostsByTag('All', page);
    };

    const infiniteRef = useInfiniteScroll({
        loading,  //loading state to change, using circular progress at the bottom was bugged
        hasNextPage: true, //In theory we could return whether there are more pages from the backend
        onLoadMore: nextPage, //call next page on scroll-past
        window //use the page as the container
    });
    //Display loading spinner for first load
  let middlePaneSize = smallScreen ? classes.smallMiddlePane : classes.middlePane;
  if (verySmallScreen) {
    middlePaneSize = classes.verySmallMiddlePane;
  }
  return loading || (posts === null) ? (
        <CircularProgress className={classes.loading} size={"5rem"} thickness={5}/>
    ) : (<Grid item sm className={middlePaneSize}>
        <GridList cellHeight={160} className={classes.gridList} cols={cols}
                  ref={infiniteRef} //For infinite scrolling
        >
            {/*If we have the posts, for each post, determine if editable, display photo, make clickable, etc*/}
            {posts.length > 0 && posts.map((post) => {
                if (post.photo) {
                    //Users can only edit/delete their own posts
                    //This is also checked on the backend, but we use this so we don't show the buttons
                    //for actions they can't perform
                    let editable = (post.user === user._id)
                    return (
                        <GridListTile cols={post.cols || 1} rows={2} className={classes.photoTile}>
                            {/*Render a post object, passing in the post itself, whether or not is editable, and some styling*/}
                            <Post
                                post={post}
                                classes={classes}
                                editable={editable}
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
export default connect(mapStateToProps, {getAllPosts, updatePost, getPostsByTag})(Feed);
