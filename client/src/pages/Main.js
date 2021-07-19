import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Header from '../pages/Header';
import Welcome from '../pages/Welcome';
import GameTable from '../pages/GameTable';
import RegistrationTable from '../pages/RegistrationTable';
import WhatToDo from '../pages/WhatToDo';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = { dataKey: null };
	}

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataPageKey = contract.methods["getGameInfo"].cacheCall(1);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : dataPageKey });
  }

  render() {

    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    let gameInfo = Marethon.getGameInfo[this.state.dataKey];

    if (gameInfo) 
	    return (
				<React.Fragment>
					<div className="App">
						<Header drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
					</div>
					<div className="App">
						<Welcome/>
						<WhatToDo drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} 
											regRound={gameInfo.value[15]} activeRound={gameInfo.value[16]} />
					</div>		
					{ gameInfo.value[16] != '0' ?
						<div  className="App">
							<Container>
							<GameTable drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} activeRound={gameInfo.value[16]} />
							</Container>
						</div> : null
					}
					<div className="App">
						<Container>
						<RegistrationTable drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} regRound={gameInfo.value[15]} />
						</Container>
					</div>		
				</React.Fragment>    	
	    );
		else
      return <div>Retrieving Round Info...</div>;	  
  }
}

export default Main;
