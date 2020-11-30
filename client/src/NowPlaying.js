import React from 'react'
import Artwork from './Artwork';

export default function NowPlaying({ nowPlaying, playlist }) {
    return (
        <div>
            <div>
                <div className="row">
                    Now Playing: { nowPlaying.name }
                </div>
                <div className="row">
                    From Playlist: { playlist.playlistName }
                </div>
            </div>
            <div>
                <div className="row">
                    <Artwork artwork={ nowPlaying.albumArt } />
                </div>
                <div className="row">
                    <Artwork artwork={ playlist.playlistArt } />
                </div>
            </div>
        </div>
    )
}
