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
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount() {
    // Get the access token in the page url
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken)
      return;

    // Access token was found : fetch data from Spotify in order to get the user name
    // Note : json() method reads a response stream until its end. It returns a promise that resoves by 
    // returning the data parsed in Json format.
    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    /* Update component's state  with the user name */
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))

    // Fetch all playlist data from Spotify
    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    /*
      Consider now each playlist
    */
    .then(playlistData => {
      let playlists = playlistData.items

      /* For each playlists, get the tracks data through the API ending point that Spotify provides by playlist */
      let trackDataPromises = playlists.map(playlist => {
        // Fetches tracks data for a playlist
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        // Turn tracks data in Json format
        let trackDataPromise = responsePromise
          .then(response => response.json())
        // Return that Json (resolving this promise)
        return trackDataPromise
      })

      let allTracksDataPromises =
        Promise.all(trackDataPromises)

      // The following code will execute when all tracks lists have been fetched for all playlists
      // Here, trackDadas will contain each result returned by each promise (iterative arguments)
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        // Let's transfrom the fetched data we received from Spotify about tracks
        // For each set of track returned for a given playlist :
        trackDatas.forEach((trackData, i) => {
          /* Attach the given result to the playlist object... */
          playlists[i].trackDatas = trackData.items
            /* ... replacing the complete item by the track data ... */
            .map(item => item.track)
            /* ... replacing the track data with an object containing only the track name and its duration */
            .map(trackData => ({
              name: trackData.name,
              duration: trackData.duration_ms / 1000
            }))
        })
        // The result returned here is then an object containing each playlists, where each playlist
        // has now a new data purpose, which is an object containing all tracks, each track being described
        // b=y an object containing its name dans duration.
        return playlists
      })
      // Return then the build data about playlists
      return playlistsPromise
    })
    .then(playlists => this.setState({
      /* Finally, we process each playlist data at the higher level : */
      playlists: playlists.map(item => {
        return {
          name: item.name,                      /* Playlist name */
          imageUrl: item.images[0].url,         /* Playlist associated image */
          songs: item.trackDatas.slice(0,3)     /* Playlist first 3 tracks */
        }
    })
    }))
  }

  render() {
    let playlistToRender =
      this.state.user &&        /* user data has to be ready/available */
      this.state.playlists      /* playlists data has to be ready/available */
        ? this.state.playlists.filter(playlist => {   /* Filter the display based on the text input field */
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()) 
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()))
          return matchesPlaylist || matchesSong
        }) : []   /* Return an empty array if data is not yest available */
    return (
      <div className="App">
        {this.state.user ?
        <div>
          <h1 style={{...defaultStyle, 'font-size': '54px'}}>
            {this.state.user.name}'s Playlists
          </h1>
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          <Filter onTextChange={text => {
              this.setState({filterString: text})
            }}/>
          {playlistToRender.map(playlist => 
            <Playlist playlist={playlist} />
          )}
        </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost') 
              ? 'http://localhost:8888/login' 
              : 'https://better-playlists-backend.herokuapp.com/login' }
          }
          style={{padding: '20px', 'font-size': '50px', 'margin-top': '20px'}}>Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;