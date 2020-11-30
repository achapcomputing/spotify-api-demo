import React, { Component } from 'react';
import './App.css';
import Playlist from './Playlist.js'

import SpotifyWebApi from 'spotify-web-api-js';
import NowPlaying from './NowPlaying';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      userId: '',
      nowPlayingViewActive: false,
      nowPlaying: { name: '', albumArt: '' },
      playlistViewActive: false,
      playlists: [],
      playlist: { playlistUri: '', playlistName: 'No Playlist', playlistArt: '' }
    }
  }

  getUserId() {
    spotifyApi.getMe()
      .then((response) => {
        console.log("in func: " + response.id);
        this.setState({
          userId: response.id
        })
      })
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        const string = response.context.uri;
        const uri = string.split(":")[2];
        this.setState({
          nowPlaying: { 
            name: response.item.name, 
            albumArt: response.item.album.images[0].url,
          },
          playlist: {
            playlistUri: uri
          }
        });
      });
  }

  getPlaylists() {
    spotifyApi.getUserPlaylists({limit: 40, offset:50})
      .then((response) => {
        this.setState({
          playlists: response.items
        });
        response.items.forEach(playlist => {
          console.log(playlist.name + " " + playlist.id);
          // this.getTracksInPlaylist(playlist.id);
        })
      });
  }

  getTracksInPlaylist(playlistId) {
    spotifyApi.getPlaylistTracks(this.state.userId, playlistId)
      .then((response) => {
        response.items.forEach(track => {
          // console.log(track.track.name);
        })
      })
  }

  getPlaylist() {
    spotifyApi.getPlaylist(this.state.userId, this.state.playlist.playlistUri)
      .then((response) => {
        console.log(response.name);
        this.setState({
          playlist: {
            playlistName: response.name,
            playlistArt: response.images[0].url
          }
        })
      });
  }

  flipNowPlayingView() {
    this.getNowPlaying();
    this.setState({
      nowPlayingViewActive: !this.state.nowPlayingViewActive
    });
  }

  flipPlaylistView() {
    this.getPlaylists();
    this.setState({
      playlistViewActive: !this.state.playlistViewActive
    })
  }

  render() {
    return (
      <div className="App">

        <a href='http://localhost:8888' > Login to Spotify </a>
        
        {/* DISPLAYS SONG CURRENTLY PLAYING */}
        <div>
          <button onClick={() => this.flipNowPlayingView()}>
            { this.state.nowPlayingViewActive ? "Hide Now Playing" : "Show Now Playing" }
          </button>
          { this.state.loggedIn && this.state.nowPlayingViewActive &&
            <div>
              <NowPlaying nowPlaying={this.state.nowPlaying} />
            </div>
          }
        </div>

        {/* DISPLAYS USER PLAYLISTS */}
        <div>
          <button onClick={() => this.flipPlaylistView()}>
            { this.state.playlistViewActive ? "Hide Playlists" : "Show Playlists" }
          </button>
          { this.state.loggedIn && this.state.playlistViewActive &&
            <div>
              <Playlist playlists={this.state.playlists} />
            </div>
          }

        </div>
      </div>
    );
  }
}

export default App;

