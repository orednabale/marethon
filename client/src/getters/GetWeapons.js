import React from "react";
import { Card, CardTitle, Row, Col, Table, Button, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

const FULL_MARETHON = 3600;

class GetWeapons extends React.Component {

  constructor(props) {
    super(props);
    this.web3 = this.props.drizzle.web3;
    this.state = {
      dataGameKey: null,
      dataUserRoundKey: null,
      nbrWeapons: 0,
      weapon: 'Bomb/s',
      source: 'wallet',
      payment: 0,
      submiited: null      
    };
  }  

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;
    // let drizzle know we want to watch the `myString` method
    const _dataGameKey = contract.methods["getGameInfo"].cacheCall(this.props.round);
    const _dataUserRoundKey = contract.methods["getUserRoundInfo"].cacheCall(this.props.drizzleState.accounts[0],this.props.round);
    // save the `dataKey` to local component state for later reference
    this.setState({ dataGameKey : _dataGameKey });
    this.setState({ dataUserRoundKey : _dataUserRoundKey });
  }

  onChangeWeapon = event => {
    let wPrice =  event.currentTarget.value == 'Peel/s' ? this.peelPrice :
                  event.currentTarget.value == 'Bomb/s' ? this.peelPrice*7 :
                  event.currentTarget.value == 'Spinach' ? this.peelPrice*15 :
                  this.peelPrice*10;
    this.setState({weapon: event.currentTarget.value});
    this.setState({payment: this.state.nbrWeapons * wPrice});
  }

  onChangeNWeapons = event => {
    let wPrice =  this.state.weapon == 'Peel/s' ? this.peelPrice :
                  this.state.weapon == 'Bomb/s' ? this.peelPrice*7 :
                  this.state.weapon == 'Spinach' ? this.peelPrice*15 :
                  this.peelPrice*10;
    this.setState({nbrWeapons: event.currentTarget.value});
    this.setState({payment: event.currentTarget.value * wPrice});
  };

  onChangeSource = event => {
    this.setState({source: event.currentTarget.value})
  };

  getMin = () => {
    return (this.state.weapon == 'Peel/s' ? 1 :
            this.state.weapon == 'Bomb/s' ? 1/7 :
            this.state.weapon == 'Spinach' ? 1/15 :
            1/10).toFixed(9);
  };

  buyWeapons()  {
    const contract = this.props.drizzle.contracts.Marethon;
    //const _payment = this.props.drizzle.web3.utils.toWei(String(this.state.payment));

    let _stackId;
    let _weapon = this.state.weapon == 'Peel/s' ? 1 :
                  this.state.weapon == 'Bomb/s' ? 2 :
                  this.state.weapon == 'Spinach' ? 3 :
                  4;
    const _payment = this.web3.utils.toWei(String(this.state.payment.toFixed(9)));
    this.setState({submitted: _payment});
    if (this.state.source == 'wallet') {
      _stackId = contract.methods["buyWeaponFromWal"].cacheSend(
          this.props.round, _weapon, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0],value:_payment}
          );
    }
    else {
      _stackId = contract.methods["buyWeaponFromBal"].cacheSend(
          this.props.round, _weapon, _payment, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0]}
          );
    }

    // save the `stackId` for later reference
    this.setState({ stackId: _stackId }); 
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


  render() {

    const { Marethon } = this.props.drizzleState.contracts;

    let gameInfo = Marethon.getGameInfo[this.state.dataGameKey];
    let userRoundInfo = Marethon.getUserRoundInfo[this.state.dataUserRoundKey];

    if ((gameInfo) && (userRoundInfo)) {
      this.peelPrice = gameInfo.value[1] != '0' ? (gameInfo.value[8]/10**18 + gameInfo.value[12]/10**18)*5/FULL_MARETHON/gameInfo.value[1] : 0;
      return (
          <React.Fragment>      
            <CardTitle>These are your weapons in Round {this.props.round}</CardTitle>       
            <Row>
              <Col>
                <Table responsive size="sm" style={{ backgroundColor: '#778899', tableLayout: 'fixed'}}>
                <tbody>
                <tr>
                  <td style={{textAlign:'right'}}>Banana Peels : </td>
                  <td><b>{this.web3.utils.fromWei(userRoundInfo.value.nPeel)}</b></td>
                </tr>
                <tr>
                  <td style={{textAlign:'right'}}>Bombs : </td>
                  <td><b>{this.web3.utils.fromWei(userRoundInfo.value.nBomb)}</b></td>
                </tr>
                <tr>
                  <td style={{textAlign:'right'}}>Spinach : </td>
                  <td><b>{this.web3.utils.fromWei(userRoundInfo.value.nSpinach)}</b></td>            
                </tr>
                <tr>
                  <td style={{textAlign:'right'}}>Shields : </td>
                  <td><b>{this.web3.utils.fromWei(userRoundInfo.value.nShield)}</b></td>
                </tr>
                </tbody>
                </Table>
              </Col>
              <Col>
                <Table responsive size="sm" style={{ backgroundColor: '#778899', tableLayout: 'fixed'}}>
                <tbody>
                <tr>
                  <td style={{textAlign:'right'}}>Peel Price : </td>
                  <td><b>{this.peelPrice.toFixed(9)}</b></td>
                </tr>
                <tr>
                  <td style={{textAlign:'right'}}>Bomb Price : </td>
                  <td><b>{(this.peelPrice*7).toFixed(9)}</b></td>
                </tr>
                <tr>
                  <td style={{textAlign:'right'}}>Spinach Price : </td>
                  <td><b>{(this.peelPrice*15).toFixed(9)}</b></td>
                </tr>
                <tr>
                  <td style={{textAlign:'right'}}>Shield Price : </td>
                  <td><b>{(this.peelPrice*10).toFixed(9)}</b></td>
                </tr>
                </tbody>
                </Table>
              </Col>
            </Row>
              {gameInfo.value[0] == 1 || gameInfo.value[0] == 2 ?
              <AvForm onValidSubmit={() => this.buyWeapons()}>
                <Row>
                <Col sm="1">
                  <FormGroup><Button color="danger">Buy</Button></FormGroup>
                </Col>
                <Col sm="3">
                  <AvField type="select" name="weapon" value={this.state.weapon} 
                    onChange={this.onChangeWeapon}>
                    <option value='Peel/s'>Peel/s</option>                   
                    <option value='Bomb/s'>Bomb/s</option>
                    <option value='Spinach'>Spinach</option>          
                    <option value='Shield/s'>Shield/s</option>
                  </AvField>
                </Col>
                <Col sm="3">
                  <AvField type="select" name="source" value="wallet" value={this.state.source} 
                    onChange={this.onChangeSource}>
                    <option value='wallet'>From Wallet</option>
                    <option value='account'>From Account</option>
                  </AvField>
                </Col>
                <Col sm="5">
                  <AvField name="nbrWeapons" placeHolder="Enter number of Weapons to buy..." type="number" 
                  value={this.state.nbrWeapons} onChange={this.onChangeNWeapons}
                  validate={{
                    required: {value: true, errorMessage: 'Empty/invalid number of weapons. Please enter valid number.'},
                    min: {value:this.getMin(),
                          errorMessage:`Minimum number of weapons should be "${this.getMin()}".`},
                    max: {value:1000, errorMessage: 'Max is 1000'}
                  }}
                  />
                </Col>
                </Row>
                <div>
                  <center><b>
                    You are buying {this.state.nbrWeapons} {this.state.weapon} for {this.state.payment.toFixed(9)} ETH from your {this.state.source}
                  </b></center>
                </div>
              </AvForm>
              : <div><center><b>This is round is already closed.</b></center></div>}
              <div>{this.getTxStatus()}</div> 
          </React.Fragment>       
      );
    }
    else
      return <CardTitle>Retrieving Weapons/Price Info...</CardTitle>;
  }
}

export default GetWeapons;
