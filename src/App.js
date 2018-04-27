import React, { Component } from 'react';
/* import './App.css'; */

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
    );
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
    );
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img />
        <h3>Playlist Name</h3>
        <ul><li>Song 1</li><li>Song 2</li><li>Song 3</li></ul>
      </div>
    );
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
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style={{...defaultStyle, 'font-size': '54px'}}>
              {this.state.serverData.user.name}'s Playlist
            </h1>
            <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
            <HoursCounter playlists={this.state.serverData.user.playlists}/>
            <Filter/>
            <Playlist/>
            <Playlist/>
            <Playlist/>
            <Playlist/>
          </div> : ' Loading...'
        }
      </div> 
    );
  }
}

export default App;
