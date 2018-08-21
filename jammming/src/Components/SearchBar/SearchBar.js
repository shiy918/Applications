import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{

	constructor(props) {
		super(props);

		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}

 	//search for playlist upon clicking
	search(e) {
		this.props.onSearch(this.state.search);
		e.preventDefault();
	}

	handleTermChange(e) {
		this.setState({term: e.target.value});
	}

	render () {
		return(
			<div className= 'SearchBar'>
				<input placeholder='Enter a song, album, or artist' onChange={this.handleTermChange}/>
				<a onClick={this.search}>Search</a>
			</div>
		)
	}
}

export default SearchBar;