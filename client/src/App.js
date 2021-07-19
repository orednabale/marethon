import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Main from "./pages/Main";

class App extends Component {
	  state = { loading: true, drizzleState: null };

	  componentDidMount() {
		const { drizzle } = this.props;

		// subscribe to changes in the store
		this.unsubscribe = drizzle.store.subscribe(() => {

		  // every time the store updates, grab the state from drizzle
		  const drizzleState = drizzle.store.getState();

		  // check to see if it's ready, if so, update local component state
		  if (drizzleState.drizzleStatus.initialized) {
			this.setState({ loading: false, drizzleState: drizzleState });
		  }
		});
	  }

	  compomentWillUnmount() {
		this.unsubscribe();
	  }
  
	render() {
			if (this.state.loading)
				return <div>Loading Drizzle..</div>;
			else
				return <Main drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />;
	}
}

export default App;
