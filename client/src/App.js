import React, { Component } from 'react';
import './App.css';
import Playlist from './Playlist.js'

import SpotifyWebApi from 'spotify-web-api-js';
import Artwork from './Artwork';
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
      nowPlayingActive: false,
      nowPlaying: { name: '', albumArt: '' },
      playlist: { playlistUri: '', playlistName: 'No Playlist', playlistArt: '' }
    }
  }

  getUserId() {
    spotifyApi.getMe()
      .then((response) => {
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
    this.getPlaylist();
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

  flipNowPlaying() {
    this.getNowPlaying();
    this.setState({
      nowPlayingActive: this.state.nowPlayingActive ? false : true
    });
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          <button onClick={() => this.flipNowPlaying()}>
            { this.state.nowPlayingActive ? "Hide Now Playing" : "Show Now Playing" }
          </button>
          { this.state.loggedIn && this.state.nowPlayingActive &&
            <div>
              <NowPlaying nowPlaying={this.state.nowPlaying} playlist={this.state.playlist} />
              {/* <Artwork artwork={this.state.playlist.playlistArt} /> */}
            </div>
          }
        </div>
        <Playlist />
      </div>
    );
  }
}

export default App;

