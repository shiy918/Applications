import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';

import SearchBar from '../Components/SearchBar/SearchBar';
import SearchResults from '../Components/SearchResults/SearchResults';
import PlayList from '../Components/Playlist/Playlist';
import Spotify from '../util/Spotify';


class App extends Component {

    constructor(props){
      super(props);


      this.state = { searchResults: [],
                      playlistName:'New Playlist',
                      playlistTracks: []};

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
     }
      


    addTrack(track) {
        if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
          return;
        }

        let currentTracks = this.state.playlistTracks;
        currentTracks.push(track);
        this.setState({playlistTracks: currentTracks});
    }

    removeTrack(track) {
       if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
         let currentTracks = this.state.playlistTracks;
         let trackIndex = currentTracks.indexOf(track);
         if(trackIndex > -1){
           currentTracks.splice(trackIndex,1);
         }      
         this.setState({playlistTracks: currentTracks});
       }
    }

    updatePlaylistName(name) {
      this.setState({playlistName: name});
    }

    savePlaylist() {
       let trackURIs = [];
       this.state.playlistTracks.forEach(track=>{trackURIs.push(track.uri);});
        Spotify.savePlaylist(this.state.playlistName,trackURIs).then(()=>{
           this.setState({playlistName:'New Playlist', playlistTracks:[]});
        });
    }

    search(term) {
      Spotify.search(term).then(tracks => {
        this.setState({searchResults: tracks});
      });
    }


    render () {

      return (
        <div>
          <h1>Ja<span className='highlight'>mmm</span>ing</h1>
          <div className='App'>
            <SearchBar onSearch={this.search}/>
            <div className='App-playlist'>
              <SearchResults searchResults={this.state.searchResults} 
                             onAdd={this.addTrack}/>
              <PlayList playlistName={this.state.playlistName} 
                        playlistTracks={this.state.playlistTracks} 
                        onRemove={this.removeTrack} 
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist}/>
            </div>
          </div>
        </div>
      )
    }
}

export default App;