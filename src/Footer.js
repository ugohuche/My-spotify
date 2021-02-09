import React, { useEffect } from 'react';
import "./Footer.css";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from '@material-ui/icons/Shuffle';
import RepeatIcon from '@material-ui/icons/Repeat';
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import { Grid, Slider } from '@material-ui/core';
import PlaylistPlayicon from '@material-ui/icons/PlaylistPlay';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import { useDataLayerValue } from './DataLayer';

function Footer({ spotify }) {
    const [{ item, playing, devices }, dispatch] = useDataLayerValue();

    useEffect(() => {
        spotify.getMyCurrentPlaybackState().then(res => {
            dispatch({
                type: "SET_PLAYING",
                playing: res.is_playing
            });

            dispatch({
                type: "SET_ITEM",
                item: res.item
            });
        });
    }, [spotify, dispatch]);

    const handlePlayPause = () => {
        if (playing) {
            spotify.pause({device_id: devices[0]?.id})
            .then( res => {
                dispatch({
                    type: "SET_PLAYING",
                    playing: false
                });
            });
        } else {
            spotify.play({device_id: devices[0]?.id})
            .then( res => {
                dispatch({
                    type: "SET_PLAYING",
                    playing: true
                });
            });
        }
    };

    const skipNext = () => {
        spotify.skipToNext({device_id: devices[0]?.id});
        spotify.getMyCurrentPlayingTrack().then(res => {
          dispatch({
            type: "SET_ITEM",
            item: res.item,
          });
          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });
        });
      };
    
      const skipPrevious = () => {
        spotify.skipToPrevious({device_id: devices[0]?.id});
        spotify.getMyCurrentPlayingTrack().then(res => {
          dispatch({
            type: "SET_ITEM",
            item: res.item,
          });
          dispatch({
            type: "SET_PLAYING",
            playing: true,
          });
        });
      };

    return (
        <div className="footer">
            <div className="footer__left">
                <img className="footer__albumLogo" src={item?.album?.images[0].url} alt={item?.name} />
                {item ? (
                    <div className="footer__songInfo">
                        <h4>{item.name}</h4>
                        <p>{item.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                ) : (
                    <div className="footer__songInfo">
                        <h4>No song is playing</h4>
                        <p>...</p>
                    </div>
                )}
            </div>

            <div className="footer__center">
                <ShuffleIcon className='footer__green' />
                <SkipPreviousIcon onClick={skipPrevious} className='footer__icon' />
                {playing ? (
                    <PauseCircleOutlineIcon onClick={handlePlayPause} className='footer__icon' fontSize="large" />
                ) : (
                    <PlayCircleOutlineIcon onClick={handlePlayPause} className='footer__icon' fontSize='large'/>
                )}
                <SkipNextIcon onClick={skipNext} className='footer__icon' />
                <RepeatIcon className="footer__green" />
            </div>

            <div className="footer__right">
                <Grid container spacing={2}>
                    <Grid item>
                        <PlaylistPlayicon />
                    </Grid>
                    <Grid item>
                        <VolumeDownIcon />
                    </Grid>
                    <Grid item xs>
                        <Slider aria-labelledby="continuous-slider" />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default Footer
