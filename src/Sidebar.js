import React from 'react'
import "./Sidebar.css";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { useDataLayerValue } from "./DataLayer";


function Sidebar({ spotify }) {

    const [{ playlists }, dispatch ] = useDataLayerValue();

    const getUserPlaylist = (id) => {
        spotify.getPlaylist(id).then(res => {
            dispatch({
                type: "SET_DISCOVER_WEEKLY",
                discover_weekly: res
            });
        })
    }

    return (
        <div className="sidebar">
            <img className="sidebar__logo" src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg" alt="" />

            <SidebarOption Icon={HomeIcon} title="Home" />
            <SidebarOption Icon={SearchIcon} title="Search" />
            <SidebarOption Icon={LibraryMusicIcon} title="Your Library" />

            <br />
            <strong className="sidebar__title">PLAYLISTS</strong>
            <hr />

            {playlists?.items?.map( playlist => (
                <SidebarOption onClick={() => getUserPlaylist(playlist.id)} key={playlist.id} title={playlist.name} />
            ))}

        </div>
    )
}

export default Sidebar