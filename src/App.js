import React, { Component } from 'react';
/* import './App.css'; */
import queryString from 'query-string';

let defaultStyle = {
  color: '#333333'
};


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
      <div style={defaultStyle}>
        <img/>
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  constructor() {
    super()
    //console.log(this.props.playlist.name)
  }
  
  render() {
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img src={this.props.playlist.imageUrl} style={{width: '300px', height: '300px'}}/>
        <h3>{this.props.playlist.name}</h3>
        <ul>
          {this.props.playlist.songs.map(song =>
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

    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    if (!accessToken)
      return;

    // Fetch username : simple merge on the first level
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer '+accessToken}
    }).then(response => response.json()
    ).then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))

    // Fetch playlists : deep merge using Object.assing()
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer '+accessToken}
    }).then(response => response.json()
    ).then(data => this.setState({
      playlists: data.items.map(item => ({
        name: item.name,
        imageUrl: item.images[0].url,
        songs: []
      }))
    }))

    //console.dir(this.state);

  }

  render() { // console.dir(this.state.playlists)

    let playlistToRender =
      this.state.user &&
      this.state.playlists
        ?  this.state.playlists.filter(playlist => 
          playlist.name.toLowerCase().includes(
            this.state.filterString ? this.state.filterString.toLowerCase() : ''))
        : []

    return (
      <div className="App">
        {this.state.user
          ? <div>
              <h1 style={{...defaultStyle, fontSize: '54px'}}>
                {this.state.user.name}'s Playlist
              </h1>
              <PlaylistCounter playlists={playlistToRender}/>
              <HoursCounter playlists={playlistToRender}/>
              <Filter onTextChange={text => {
              this.setState({filterString: text})
            }}/>
              {playlistToRender.map(playlist =>
                <Playlist playlist={playlist} />
              )}
            </div>
          : <button onClick={()=>window.location='http://localhost:8888/login'} style={{padding: '20px', fontSize: '50px', marginTop: '20px'}}>Sign in with Spotify</button>
        }
      </div> 
    )
  }

}

export default App
