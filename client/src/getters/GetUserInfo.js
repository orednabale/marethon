import React from "react";

class GetUserInfo extends React.Component {
  state = { dataKey: null };

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataKey = contract.methods["getUserInfo"].cacheCall(this.props.drizzleState.accounts[0]);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey });
  }

  render() {
    // get the contract state from drizzleState
    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const userInfo = Marethon.getUserInfo[this.state.dataKey];
    // if it exists, then we display its value
	
	if (userInfo)
			return (
				<div>
				<p>User Info</p>
				<p>Eth Balance: {userInfo.value.ethBalance}</p>
					<p>Affiliate : {userInfo.value.affAddr}</p>
					<p>Number of Rounds : {userInfo.value.nRounds}</p>
					<p>Number of Reserved Names : {userInfo.value.nResTags}</p>
				</div>
			);
	else
		return <p>User Info : Not retrieved</p>;
	
  }
}

export default GetUserInfo;
