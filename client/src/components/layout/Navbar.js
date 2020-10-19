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

const useStyles = makeStyles((theme) => ({
    primaryColor: {
        color: '#fff',
        backgroundColor: theme.palette.primary.light,
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
const Navbar = ({auth: {isAuthenticated, loading, user}, logout}) => {
    //Theme
    const classes = useStyles();

    //Avatar Button Menu
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const authLinks = (
        <ul>
            <Avatar aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} className={classes.primaryColor}>{user && (user.firstName[0])}</Avatar>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Card className={classes.profileCard}>
                    <Avatar className={classes.bigAvatar}>{user && (user.firstName[0])}</Avatar>
                    <Typography className={classes.name}>
                       {user && user.firstName + ' ' + user.lastName}
                   </Typography>
                    <Typography><b>31 Minutes Elapsed</b></Typography>
                </Card>
                <MenuItem onClick={() => {handleClose(); logout()}}>Sign Out</MenuItem>
            </Menu>
        </ul>
    );

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

    return (
        <nav className='navbar bg-dark'>
            <h1>
                <Link to='/'>
                    DevWorthy
                </Link>
            </h1>
            {!loading && (
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
