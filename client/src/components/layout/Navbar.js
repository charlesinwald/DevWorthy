import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {logout} from '../../actions/auth';
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from '@material-ui/core/styles';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Timer from "./Timer";

const useStyles = makeStyles((theme) => ({
    //minty color in avatar, white text, clickable
    primaryColor: {
        color: '#fff',
        backgroundColor: theme.palette.primary.light,
        cursor: "pointer"
    },
    profileCard: {
        margin: '1rem'
    },
    name: {
        margin: '.5rem'
    },
    bigAvatar: {
        color: '#fff',
        backgroundColor: theme.palette.primary.light,
        margin: 'auto'
    }
}));
//We pass in the state of their authentication, loading status, user info,
// and function for logging out
const Navbar = ({auth: {isAuthenticated, loading, user}, logout}) => {
    //Theme
    const classes = useStyles();

    //Avatar Button Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    //Opens Profile Menu
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    //Closes Profile Menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    const authLinks = (
        <ul>
            {/*If user is true, obtain first initial via 0th index of first name property of user object*/}
            <Avatar aria-controls="simple-menu" aria-haspopup="true" clickable onClick={handleClick} className={classes.primaryColor}>{user && (user.firstName[0])}</Avatar>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                // Keep mounted as DOM node, perhaps not necessary
                keepMounted
                // When True, open menu
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Card className={classes.profileCard}>
                    {/*If user is true, obtain first initial via 0th index of first name property of user object*/}
                    <Avatar className={classes.bigAvatar}>{user && (user.firstName[0])}</Avatar>
                    {/*If user is true, obtain full name from user object*/}
                    <Typography className={classes.name}>
                       {user && user.firstName + ' ' + user.lastName}
                   </Typography>
                    {/*import Timer.js to be shown here*/}
                    <Timer/>
                    {/*Alert will be some type of Dialog, modal, or popover in corner of screen, to something of that effect, that triggers*/}
                    {/*when a certain state is reached*/}
                </Card>
                {/*Sign out and close dialog box, as dialog would still be open otherwise*/}
                <MenuItem onClick={() => {handleClose(); logout()}}>Sign Out</MenuItem>
            </Menu>
        </ul>
    );
//If user is signed out, don't try to show them the profile or sign out buttons...
    const guestLinks = (
        <ul>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </ul>
    );
//Determines which version of the navbar to show: signed in vs signed out
    return (
        <nav className='navbar bg-dark'>
            {/*Devworthy link is always showing*/}
            <h1>
                <Link to='/'>
                    DevWorthy
                </Link>
            </h1>
            {!loading && (
                //Signed in vs Sign out
                <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
            )}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    {logout}
)(Navbar);
