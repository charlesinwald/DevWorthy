import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import {getAllPosts} from "../../actions/post";
import Spinner from "./Spinner";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
        width: '100%',
        padding: '.5rem'
    },
    middlePane: {
        margin: 'auto',
        width: '100%'
    }
}));



const Feed = ({
                  getAllPosts,
                  auth: {user},
                  posts: {posts, loading}
              }
) => {

    useEffect(() => {
        getAllPosts()
    }, [getAllPosts]);


    const classes = useStyles();
    return loading && posts === null ? (
        <Spinner/>
    ) : (<Grid item sm={6} className={classes.middlePane}>
        <Grid spacing={3} container>
            {posts && posts.map(post => <Grid item sm={12} key={post._id}>{post.title}<br/> {post.text} </Grid>)}

        </Grid>
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
export default connect(mapStateToProps, {getAllPosts})(Feed);