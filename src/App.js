import { useEffect } from "react";
import './App.css';
import Login from './Login';
import Player from './Player'; 
import { getTokenFromUrl } from "./spotify";
import SpotifyWebApi from "spotify-web-api-js";
import { useDataLayerValue } from "./DataLayer";

const spotify = new SpotifyWebApi();

function App() {

  const checkAuthTimeout = (expirationTime) => {
    setTimeout(() => {
      dispatch({
        type: 'SET_TOKEN',
        token: null
      });
    }, expirationTime * 1000);
  }

  const authCheckState = () => {
    const _token = localStorage.getItem('token');
    if (_token === undefined) {
        return Promise.reject();
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if ( expirationDate <= new Date() ) {
            return Promise.reject();
        } else {
            checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000);
            return Promise.resolve(_token);
        }
    }
  }

  const [{token}, dispatch] = useDataLayerValue();

  useEffect(() => {
    // This effect is "effective" when the user goes through login process
    const hash = getTokenFromUrl();
    const _token = hash.access_token;
    window.location.hash = "";
    if (_token) {
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      checkAuthTimeout(3600);
      localStorage.setItem('token', _token);
      localStorage.setItem('expirationDate', expirationDate);
    }

    if (_token) {
      dispatch({
        type: 'SET_TOKEN',
        token: _token
      });

      spotify.setAccessToken(_token);
      spotify.getMyDevices().then(devices => {

        dispatch({
          type: 'SET_DEVICES',
          devices
        });
      });

      spotify.getMe().then(user => {

        dispatch({
          type: 'SET_USER',
          user
        });
      });

      spotify.getMyTopArtists().then( res => {
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: res
        });
      });
      
      spotify.getUserPlaylists().then(playlists => {
  
        spotify.getPlaylist(playlists?.items[0]?.id).then(response => {
          dispatch({
            type: "SET_DISCOVER_WEEKLY",
            discover_weekly: response
          });
        });
  
        dispatch({
          type: "SET_PLAYLISTS",
          playlists
        });
      });

    }
  }, [])


  useEffect(() => {

      // Authcheckstate is for when token is already stored in local Storage
      authCheckState()
      .then(res => {
        dispatch({
          type: 'SET_TOKEN',
          token: res
        });
  
        spotify.setAccessToken(res);

        spotify.getMyDevices().then(devices => {

          dispatch({
            type: 'SET_DEVICES',
            devices
          });
        });
  
        spotify.getMe().then(user => {
          dispatch({
            type: 'SET_USER',
            user
          });
        });
  
        spotify.getMyTopArtists().then( res => {
          dispatch({
            type: "SET_TOP_ARTISTS",
            top_artists: res
          });
        });
        
        spotify.getUserPlaylists().then(playlists => {
  
          spotify.getPlaylist(playlists?.items[0]?.id).then(response => {
            dispatch({
              type: "SET_DISCOVER_WEEKLY",
              discover_weekly: response
            });
          });
  
          dispatch({
            type: "SET_PLAYLISTS",
            playlists
          });
        });
      })
  }, [])


  return (
    <div className="app">
      {
        token ? (
          <Player spotify={spotify} />
        ) : (
          <Login />
        )
      }
    </div>
  );
}

export default App;
