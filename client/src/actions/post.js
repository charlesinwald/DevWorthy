import axios from 'axios';
import { setAlert } from './alert';

import {
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_POST,
  CLEAR_POST,
  GET_ALL_POSTS,
  DELETE_POST,
  LOADING, SET_TAG, GET_MORE_POSTS
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
export const getAllPosts = (page=1) => async dispatch => {
  // dispatch({ type: CLEAR_POST });

  try {
    //Ask backend for all the posts
    if (page === 1) {
      dispatch({type: LOADING });
    }
    dispatch({
      type: SET_TAG,
      payload: 'All'
    });
    let url = `/api/post?page=${page}`;
    const res = await axios.get(url);
    //We change the state, by dispatching the get all posts action
    //This adds all the posts to the central Redux store, and signifies that we are done loading
    if (page === 1) {
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    }
    else {
      dispatch({
        type: GET_MORE_POSTS,
        payload: res.data
      });
    }
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all posts
export const getPostsByTag = (tag, page=1) => async dispatch => {
  // dispatch({ type: CLEAR_POST });
  try {
    if (page === 1) {
      dispatch({type: LOADING });
    }
    //Ask backend for all the posts
    dispatch({
      type: SET_TAG,
      payload: tag
    });
    let url = '/api/post?' + 'page=' + page;
    if (tag && tag !== 'All') {
      url = url + '&tag=' + tag
    }
    const res = await axios.get(url);
    //We change the state, by dispatching the get all posts action
    //This adds all the posts to the central Redux store, and signifies that we are done loading
    if (page === 1) {
      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    }
    else {
      dispatch({
        type: GET_MORE_POSTS,
        payload: res.data
      });
    }

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

// Create post
export const createPost = (
  formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    //Expects a form data object with the fields that the backend wants (title, photo
    const res = await axios.post('/api/post', formData, config);

    dispatch({
      type: GET_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'warning')));
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

    dispatch(setAlert('Post Updated', 'success'));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'warning')));
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete post
export const deletePost = (
    post) => async dispatch => {
  try {
    // const body = JSON.stringify({ post_id });
    //Axios DELETE is a little bit different, body and config must be one object
    const res = await axios.delete('/api/post/', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "post_id" : post._id
      }
    });
    dispatch({
      type: DELETE_POST,
      payload: post
    });

    dispatch(setAlert('Post Deleted', 'success'));


  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'warning')));
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete post
export const vote = (
    post, vote) => async dispatch => {
  try {
    // const body = JSON.stringify({ post_id });
    //Axios DELETE is a little bit different, body and config must be one object
    const res = await axios.post('/api/post/vote', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "post_id" : post._id,
        "vote_type":vote
      }
    });
    // dispatch({
    //   type: DELETE_POST,
    //   payload: post
    // });

    dispatch(setAlert('Voted', 'success'));


  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'warning')));
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};