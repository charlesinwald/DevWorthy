import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_POST,
  CLEAR_POST,
  ACCOUNT_DELETED,
  GET_REPOS, GET_ALL_POSTS
} from './types';

// Get current users posts
export const getCurrentUsersPosts = (user) => async dispatch => {
  try {
    const res = await axios.get('/api/post/user/' + user._id);
    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all posts
export const getAllPosts = () => async dispatch => {
  // dispatch({ type: CLEAR_POST });

  try {
    const res = await axios.get('/api/post');

    dispatch({
      type: GET_ALL_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get post by ID
export const getPostByPostId = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/post/${userId}`);

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or update post
export const createPost = (
  formData,
  history) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/post', formData, config);

    dispatch({
      type: GET_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));

    history.push('/Home');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};