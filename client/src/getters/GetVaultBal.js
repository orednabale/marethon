import React from "react";

class GetVaultBal extends React.Component {

  constructor(props) {
    super(props);

    this.state = { dataKey: null };
    this.web3 = this.props.drizzle.web3;
  }

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
		return ` ${this.web3.utils.fromWei(userInfo.value.ethBalance)}`;
	else
		return null;
  }
}

export default GetVaultBal;
