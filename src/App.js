import React, { Component } from 'react';
/* import './App.css'; */
import queryString from 'query-string';

let defaultStyle = {
  color: '#333333'
};

let fakeServerData = {
  user: {
    name: "Cédric",
    playlists: [
      {
        name: 'My favorites',
        songs: [
          {name: 'Song A', duration: 1547}, 
          {name: 'Song B', duration: 1247}, 
          {name: 'Song C', duration: 1003}]
      },
      {
        name: 'Songs to discover!',
        songs: [
          {name: 'Song E', duration: 2014}, 
          {name: 'Song F', duration: 1874}, 
          {name: 'Song G', duration: 1600}]
      },
      {
        name: 'Most downloaded',
        songs: [
          {name: 'Song I', duration: 1347}, 
          {name: 'Song J', duration: 1257}, 
          {name: 'Song K', duration: 1798}]
      },
      {
        name: 'Worst songs ever',
        songs: [
          {name: 'Song M', duration: 980}, 
          {name: 'Song N', duration: 640}, 
          {name: 'Song O', duration: 3400}]
      },
    ]
  }
}

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs);
    } , []);
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration;
    } , 0);
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/3600)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{defaultStyle}}>
        <input type="text"/>
        Filter
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img />
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {serverData: {}}
  }
  componentDidMount() {
    
    setTimeout(() => {
      this.setState({serverData: fakeServerData})
    }, 250);
    
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer '+accessToken}
    }).then(response => response.json()
    ).then(data => console.log(data))
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style={{...defaultStyle, fontSize: '54px'}}>
              {this.state.serverData.user.name}'s Playlist
            </h1>
            <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
            <HoursCounter playlists={this.state.serverData.user.playlists}/>
            <Filter/>
            {this.state.serverData.user.playlists.map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div> : <button onClick={()=>window.location='http://localhost:8888/login'} style={{padding: '20px', fontSize: '50px', marginTop: '20px'}}>Sign in with Spotify</button>
        }
      </div> 
    )
  }
}

export default App
