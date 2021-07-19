import React from "react";
import { Card, CardTitle, Row, Col, Table, Button, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

class GetShares extends React.Component {

  constructor(props) {
    super(props);
    this.claimShares = this.claimShares.bind(this);    
    this.getTxStatus = this.getTxStatus.bind(this);
    this.onChangeShare = this.onChangeShare.bind(this);  
    this.web3 = this.props.drizzle.web3;
    this.state = {
      stackId: null,
      dataUserRoundKey: null,      
      shares2Claim: 0,
      all: false,
      actual:0
    };
  }  

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    const _dataUserRoundKey = contract.methods["getUserRoundInfo"].cacheCall(this.props.drizzleState.accounts[0],this.props.round);
    this.setState({ dataUserRoundKey : _dataUserRoundKey });
  }

  claimShares() {

    const actualShare = this.web3.utils.toWei(String(this.state.shares2Claim));
    if (actualShare == 0)
        return;
    const claimAll = this.state.all;
    const contract = this.props.drizzle.contracts.Marethon;
    
    let _stackId;
    // let drizzle know we want to call the `set` method with `value`

    _stackId = contract.methods["claimShares"].cacheSend(
        this.props.round, actualShare, claimAll,
        {from: this.props.drizzleState.accounts[0]}
    );
    // save the `stackId` for later reference
    this.setState({ stackId: _stackId }); 
    this.setState({ actual: actualShare});
  
  }

  getTxStatus() {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return (
      <div>
        <p>
          <center>
              Current Tx Status of<br/>
              <a href={`https://etherscan.io/tx/${txHash}`} style={{color:'#8B0000'}} target="_blank">{txHash}</a><br/>
              {transactions[txHash].status.toUpperCase()}<br/>
              Click link to monitor transaction in Etherscan.
          </center>
        </p>
      </div>
    );
  };

  onChangeShare(event) {
    this.setState({ shares2Claim: event.currentTarget.value })
  }

  render() {

    const { Marethon } = this.props.drizzleState.contracts;

    let userRoundInfo = Marethon.getUserRoundInfo[this.state.dataUserRoundKey];
    const zeroValidation = value => value != 0 ? true : "Withdrawal amount must not be zero."

    if (userRoundInfo) {
      this.sharesLeft = userRoundInfo.value.shares/10**18 - userRoundInfo.value.sharesClaimed/10**18;
      return (
          <React.Fragment> 
            <CardTitle>These are your shares for Round {this.props.round}</CardTitle>   
            <Row>    
              <Table responsive size="sm" style={{ backgroundColor: '#778899'}}>
              <tbody>
              <tr>
                <td style={{textAlign:'right'}}>Total Shares : </td>
                <td><b>{userRoundInfo.value.shares / 10**18}</b></td>
              </tr>
              <tr>
                <td style={{textAlign:'right'}}>Shares Claimed : </td>
                <td><b>{userRoundInfo.value.sharesClaimed / 10**18}</b></td>
              </tr>
              <tr>
                <td style={{textAlign:'right'}}>Shares Left : </td>
                <td><b>{this.sharesLeft}</b></td>
              </tr>
              </tbody>
              </Table>
            </Row>
            <AvForm onValidSubmit={() => this.claimShares()}>
              <FormGroup className="text-center"><Button color="danger" disabled={this.props.balance == 0}>Claim Shares</Button></FormGroup>
              <AvField name="amount" placeHolder="Enter shares to claim..." type="number" required={!this.state.all} disabled={this.state.all}
                value={this.state.shares2Claim}
                onChange={this.onChangeShare}
                validate={!this.state.all ?
                  {
                    required: {value: true, errorMessage: 'Empty/invalid shares. Please enter valid shares to claim.'},
                    min: {value: 0, errorMessage:'Shares must not be negative.'},
                    max: {value: this.sharesLeft, errorMessage: `Shares to claim must not be greater than "${this.sharesLeft}".`}, 
                    zeroValidation
                  }
                  : {}
                } 
              />
              <AvField  type="checkbox" name="claimAll" label="Claim All Shares Left" value={this.state.all}
                        onClick={() => this.setState(
                            { all: !this.state.all,  
                              shares2Claim:!this.state.all ? this.sharesLeft:''})
                        }
              />
            </AvForm>
            <div>{this.getTxStatus()}</div> 
          </React.Fragment>       
      );
    }
    else
      return <CardTitle>Retrieving User Shares Info...</CardTitle>;
  }
}

export default GetShares;
