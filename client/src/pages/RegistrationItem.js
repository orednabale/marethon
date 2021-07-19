import React, { Component } from 'react';
import Blockies from 'react-blockies';

class RegistrationItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			runnerInfoKey: null,
		};
		this.web3 = this.props.drizzle.web3; 
	}

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const _runnerInfoKey = contract.methods["getRunnerInfo"].cacheCall(this.props.regRound, parseInt(this.props.runner));

    this.setState({ runnerInfoKey : _runnerInfoKey });
  }

  render() {
	  
	  const { Marethon } = this.props.drizzleState.contracts;  	
	  const runnerInfo = Marethon.getRunnerInfo[this.state.runnerInfoKey];

    return (
    	<React.Fragment>
    	{runnerInfo ?
				<tr>
					<td>{this.props.runner}</td>
					<td><Blockies seed={runnerInfo.value.owner.toLowerCase() + this.web3.utils.hexToUtf8(runnerInfo.value.tagName)} 
						size={10} scale={5} /></td>
					<td>{this.web3.utils.hexToUtf8(runnerInfo.value.tagName)}</td>
					<td></td>
					<td>{runnerInfo.value.owner.toLowerCase()}</td>				
				</tr>:
				<tr>Retrieving Runner Info...</tr>
			}
      </React.Fragment>
    );
  }
}

export default RegistrationItem;
