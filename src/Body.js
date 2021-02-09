import React from 'react';
import "./Body.css";
import { useDataLayerValue } from './DataLayer';
import Header from './Header';
import SongRow from './SongRow';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


function Body({ spotify }) {
    const [{ discover_weekly, devices }, dispatch] = useDataLayerValue();
    
    const playPlaylist = (id) => {
        spotify.play({
            context_uri: `spotify:playlist:${id}`,
            device_id: devices[0]?.id
        })
        .then(res => {
            spotify.getMyCurrentPlayingTrack().then(r => {
                dispatch({
                    type: "SET_ITEM",
                    item: r.item
                });
                dispatch({
                    type: "SET_PLAYING",
                    playing: true
                });
            });
        });
    }

    const playSong = (id) => {
        spotify.play({
            uris: [`spotify:track:${id}`,],
            device_id: devices[0]?.id
        })
        .then(res => {
            spotify.getMyCurrentPlayingTrack().then(r => {
                dispatch({
                    type: "SET_ITEM",
                    item: r.item
                });
                dispatch({
                    type: "SET_PLAYING",
                    playing: true
                });
            });
        });
    }

    return (
        <div className="body">
            <Header spotify={spotify} />

            <div className="body__info">
                <img src={discover_weekly?.images[0]?.url} alt="" />
                <div className="body__infoText">
                    <strong>PLAYLIST</strong>
                    <h2>{discover_weekly?.name}</h2>
                    <p>{discover_weekly?.description}</p>
                </div>
            </div>

            <div className="body__songs">
                <div className="body__icons">
                    <PlayCircleFilledIcon onClick={() => playPlaylist(discover_weekly?.id)} className="body__shuffle" />
                    <FavoriteIcon fontSize="large" />
                    <MoreHorizIcon />
                </div>

                {discover_weekly?.tracks.items.map(item => (
                    <SongRow playSong={playSong} key={item.track.name} track={item.track} />
                ))}
            </div>
        </div>
    );
}

export default Body
