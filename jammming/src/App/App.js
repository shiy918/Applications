import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';

import SearchBar from '../Components/SearchBar/SearchBar';
import SearchResults from '../Components/SearchResults/SearchResults';
import PlayList from '../Components/Playlist/Playlist';
import Spotify from '../util/Spotify';
import Loading from '../Components/Loading/Loading';



class App extends Component {

    constructor(props){
      super(props);


      this.state = {  searchResults: [],
                      playlistName:'New Playlist',
                      playlistTracks: [],
                      //set the loading state to keep track of the loading process
                      loading: false
                    };

      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
     }
      
     //add a track to a playlist
    addTrack(track) {
        if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
          return;
        }

        //create a copy of the playlist tracks
        const playlistTracks = [...this.state.playlistTracks];

        //push track to the copy
        playlistTracks.push(track);

        //final modification of the playlist 
        this.setState({playlistTracks: playlistTracks});
    }

    //remove a track from a playlist 
    removeTrack(track) {
       if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
         //create a new copy of the playlist for alteration
         let currentTracks = [...this.state.playlistTracks];

         let trackIndex = currentTracks.indexOf(track);

         //get rid of the track using its index
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
      
       //reset state of loading after SAVE button is being clicked on
       this.setState({ loading: true}, ()=>{

          //update playlist
          let trackURIs = [];
          this.state.playlistTracks.forEach(track=>{trackURIs.push(track.uri);});
          Spotify.savePlaylist(this.state.playlistName,trackURIs)
          //after updating, set new states
          .then(()=>{
          this.setState({playlistName:'New Playlist', playlistTracks:[], loading: false});
        })
       });

        //display success if a playlist is saved
        this.setState({success: true});
      
    }

    //search for tracks using Spotify API
    search(term) {
      Spotify.search(term).then(tracks => {
        this.setState({searchResults: tracks});
      });
    }


    render () {

      // const {success} = this.state;
      const {loading} = this.state;

      //if a playlist is loading, show a loader
       if(loading){
        return (
          <div>
            <h1>Ja<span className='highlight'>mmm</span>ing</h1>
            <div className='App'>
              <Loading />
            </div>
          </div>
        );
      }


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