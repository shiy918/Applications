import React from 'react';

const client_ID = 'f649ad68b6ee47a8806188f65e946f4e';
const redirect_uri = 'http://localhost:3000/';

let accessToken = '';
let expiresIn = '';


const Spotify = {

	//get the access token 
	getAccessToken() {
		if (accessToken){
			return accessToken;
		}

		else{
			const url = window.location.href;
			const newToken = url.match(/access_token=([^&]*)/);
			const newExpire = url.match(/expires_in=([^&]*)/);
		

			if(newToken && newExpire){
				accessToken = newToken[1];
				expiresIn = newExpire[1];

				window.setTimeout(()=> accessToken='',expiresIn * 1000)
				window.history.pushState('Access Token', null,'/')
				return accessToken;
			}

			else{
				const urlstring = `https://accounts.spotify.com/authorize?client_id=${client_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
				window.location = urlstring;
			}

		}

 	 },

 	//search for playlists using Spotify 
 	search(term) {
 	 	let accessToken = Spotify.getAccessToken();
        let searchURL = `https://api.spotify.com/v1/search?type=track&q=${term}`;

 	 	return fetch(searchURL, { headers: {Authorization: `Bearer ${accessToken}`}})
 	 	.then(response => {
 	 		if (response.ok){return response.json();}
 	 		throw new Error ('Request failed!');
 	 	}, networkError => {console.log(networkError.message);}
 
 	 ).then(jsonResponse => {
 	 	if(!jsonResponse.tracks){
 	 		return [];
 	 	}

 	 	else{
 	 		return jsonResponse.tracks.items.map(track=>({
 	 			id:track.id,
 	 			name:track.name,
 	 			artist:track.artists[0].name,
 	 			album: track.album.name,
 	 			uri: track.uri
 	 		}));
 	 	}
 	 })

 	},

 	//save the playlist to an account 
 	savePlaylist(playlistName,trackURIs){
 		if (!accessToken){
 			accessToken = Spotify.getAccessToken();
 		}

 		const headers = {Authorization: `Bearer ${accessToken}`};
 		let user_id = '';

 		if (!playlistName && !trackURIs){
 			return;
 		}

 		else {
 			return fetch('https://api.spotify.com/v1/me', {headers: headers})
 			.then(response => {return response.json();})
 			.then(jsonResponse => {
 				user_id = jsonResponse.id;

 				return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, 
 							  {headers: headers,
 							  method: 'POST',
 							  body: JSON.stringify({name: playlistName})})
 				.then(response => {return response.json();})
 				.then(jsonResponse => {
 					
 					let playlist_id = jsonResponse.id;

 					return fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,
 							      {headers: headers,
 							      method: 'POST',
 							      body: JSON.stringify({uris: trackURIs})})
 				})

 			})
 		}
 	}



};


export default Spotify;