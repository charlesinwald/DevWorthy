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
    console.log('GetAllPosts')
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

// Create post
export const createPost = (
  formData) => async dispatch => {
  console.log('createPost reached');
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

// Update post
export const updatePost = (
    title, text, post_id) => async dispatch => {
  console.log('updatePost reached');
  console.log(title, text, post_id);
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ title, text, post_id });

    const res = await axios.put('/api/post/', body, config);

    dispatch({
      type: GET_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));

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