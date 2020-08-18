import Grid from "@material-ui/core/Grid";
import React, {useEffect} from "react";
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import Spinner from "./Spinner";
import {getCurrentUsersPosts} from '../../actions/post';
import {makeStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#b3cdd1',
        backgroundImage: 'linear-gradient(315deg, #b3cdd1 0%, #9fa4c4 74%)',
        position: 'sticky',
        minHeight: '75vh',
        maxHeight: '85vh',
        padding: '3rem',
        borderRadius: '9%',
        overflow: 'hidden',
        boxshadow: '0 10px 25px rgba(8, 112, 184, 0.7)',
        marginBottom: '1.5rem',
        color: '#cc'
        },
    avatar: {
        width: theme.spacing(17),
        height: theme.spacing(17),
        margin: 'auto',
        fontSize: '3rem'
    },
    name: {
        textAlign: 'center',
        color: 'white'
    }
}));

const ProfilePane = ({
                         getCurrentUsersPosts,
                         auth: {user},
                         posts: {posts, loading}
                     }
) => {

    useEffect(() => {
        getCurrentUsersPosts(user);
    }, [getCurrentUsersPosts]);

    const classes = useStyles();


    return loading && posts === null ? (
        <Spinner/>
    ) : (<Grid container sm={3} className={classes.root} boxShadow={3}>
        <Grid item sm={12}>
            <Avatar className={classes.avatar}><h1>{user && user.firstName[0]}</h1></Avatar>
        </Grid>
        <Grid item sm={12}>
        <h2 className={classes.name}>
            {user && user.firstName + ' ' + user.lastName}
        </h2>
        </Grid>
            <ul>
                <h4>Recent Posts: </h4>
                {posts && posts.slice(Math.max(posts.length - 5, 0)).map(post => <li key={post._id}>{post.title} </li>)}
            </ul>
    </Grid>);
};

ProfilePane.propTypes = {
    getCurrentUsersPosts: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    posts: state.post,
});
export default connect(mapStateToProps, {getCurrentUsersPosts})(ProfilePane);