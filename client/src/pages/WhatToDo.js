import React from "react";
import { Card, CardTitle, Row, Col, Table, Button, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

const FULL_MARETHON = 3600;

class WhatToDo extends React.Component {

  constructor(props) {
    super(props);
    this.web3 = this.props.drizzle.web3;
    this.state = {
      regRoundKey: null,
      activeRoundKey: null,
      action: 'register',
      round: this.props.regRound,
      nbrWeapons: 0.0,
      weapon: 'Peel/s',
      source: 'wallet',
      payment: 0.1,
      name: '',
      submiited: null      
    };
  }  

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;
    // let drizzle know we want to watch the `myString` method
    const _regRoundKey = contract.methods["getGameInfo"].cacheCall(this.props.regRound);
    let _activeRoundKey;
    if (this.props.activeRound != '0') {
      _activeRoundKey = contract.methods["getGameInfo"].cacheCall(this.props.activeRound);
      this.setState({ activeRoundKey : _activeRoundKey });
    }
    this.setState({ regRoundKey : _regRoundKey });
  }

  onChangeAction = event => {
    this.setState({action: event.currentTarget.value});
    let amount = 0.1

    if (event.currentTarget.value == 'buy') {
      let peelPrice;
      if (this.props.activeRound != '0') {
        peelPrice = this.activePeelPrice;
        this.setState({round: this.props.activeRound});  
      } else { 
        peelPrice = this.regPeelPrice;
        this.setState({round: this.props.regRound});
      }
      let wPrice =  this.state.weapon == 'Peel/s' ? peelPrice :
                    this.state.weapon == 'Bomb/s' ? peelPrice*7 :
                    this.state.weapon == 'Spinach' ? peelPrice*15 :
                    peelPrice*10;
      amount = this.state.nbrWeapons * wPrice;
    }

    if (event.currentTarget.value == 'register')
      this.setState({round: this.props.regRound});

    this.setState({payment: amount});
  }

  onChangeName = event => {
    this.setState({ name: event.currentTarget.value })
  }

  onChangeWeapon = event => {
    let peelPrice = this.state.round == this.props.regRound ? this.regPeelPrice : this.activePeelPrice;
    let wPrice =  event.currentTarget.value == 'Peel/s' ? peelPrice :
                  event.currentTarget.value == 'Bomb/s' ? peelPrice*7 :
                  event.currentTarget.value == 'Spinach' ? peelPrice*15 :
                  peelPrice*10;
    this.setState({weapon: event.currentTarget.value});
    this.setState({payment: this.state.nbrWeapons * wPrice});
  }

  onChangeNWeapons = event => {
    let peelPrice = this.state.round == this.props.regRound ? this.regPeelPrice : this.activePeelPrice;
    let wPrice =  this.state.weapon == 'Peel/s' ? peelPrice :
                  this.state.weapon == 'Bomb/s' ? peelPrice*7 :
                  this.state.weapon == 'Spinach' ? peelPrice*15 :
                  peelPrice*10;
    this.setState({nbrWeapons: parseFloat(event.currentTarget.value)});
    this.setState({payment: parseFloat(event.currentTarget.value) * wPrice});
  }

  onChangeSource = event => {
    this.setState({source: event.currentTarget.value})
  }

  onChangeRound = event => {
    let peelPrice = event.currentTarget.value == this.props.regRound ? this.regPeelPrice : this.activePeelPrice;
    let wPrice =  this.state.weapon == 'Peel/s' ? peelPrice :
                  this.state.weapon == 'Bomb/s' ? peelPrice*7 :
                  this.state.weapon == 'Spinach' ? peelPrice*15 :
                  peelPrice*10;    
    this.setState({round: event.currentTarget.value})
    this.setState({payment: this.state.nbrWeapons * wPrice});
  }

  getMin() {
    return (this.state.weapon == 'Peel/s' ? 1 :
            this.state.weapon == 'Bomb/s' ? 1/7 :
            this.state.weapon == 'Spinach' ? 1/15 :
            1/10).toFixed(9);
  }

  buyWeapons() {
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
          this.state.round, _weapon, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0],value:_payment}
          );
    }
    else {
      _stackId = contract.methods["buyWeaponFromBal"].cacheSend(
          this.state.round, _weapon, _payment, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0]}
          );
    }

    // save the `stackId` for later reference
    this.setState({ stackId: _stackId }); 
  }

  registerRunner() {
    const contract = this.props.drizzle.contracts.Marethon;
    //const _payment = this.props.drizzle.web3.utils.toWei(String(this.state.payment));

    let _stackId;

    const _payment = this.web3.utils.toWei(String(this.state.payment.toFixed(9)));
    this.setState({submitted: _payment});

    if (this.state.source == 'wallet') {
      _stackId = contract.methods["registerFromWal"].cacheSend(
          this.state.name, "aff", "0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0],value:_payment}
          );
    }
    else {
      _stackId = contract.methods["registerFromBal"].cacheSend(
          this.state.name, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0]}
          );
    }

    // save the `stackId` for later reference
    this.setState({ stackId: _stackId }); 
  }

  reserveName() {
    const contract = this.props.drizzle.contracts.Marethon;
    //const _payment = this.props.drizzle.web3.utils.toWei(String(this.state.payment));

    let _stackId;

    const _payment = this.web3.utils.toWei(String(this.state.payment.toFixed(9)));
    this.setState({submitted: _payment});

    if (this.state.source == 'wallet') {
      _stackId = contract.methods["reserveNameFromWal"].cacheSend(
          this.state.name, "aff", "0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0],value:_payment}
          );
    }
    else {
      _stackId = contract.methods["reserveNameFromBal"].cacheSend(
          this.state.name, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
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
  }

  showInput() {
    return (
    this.state.action == 'register' ?
      <Col sm='auto'>
        <AvField name="regName" placeHolder="What name?" type="text" required 
          value={this.state.name}
          onChange={this.onChangeName}
          validate={
            {
              required: {value: true, errorMessage: 'Please enter a runner name'},
              pattern: {value: '^[a-z0-9 ]+$', errorMessage: 'Runner names must only contain\nsmall letters, numbers and spaces in between words'},
              maxLength: {value: 32, errorMessage: 'Runner names must be between 1 and 32 characters'}
            }
          } 
        />
      </Col> :
    this.state.action == 'reserve' ?
      <Col sm='auto'>
        <AvField name="resName" placeHolder="What name?" type="text" required 
          value={this.state.name}
          onChange={this.onChangeName}
          validate={
            {
              required: {value: true, errorMessage: 'Please enter a runner name'},
              pattern: {value: '^[a-z0-9 ]+$', errorMessage: 'Runner names must only contain small letters, numbers and spaces in between words'},
              maxLength: {value: 32, errorMessage: 'Runner names must be between 1 and 32 characters'}
            }
          } 
        />
      </Col> :
    <React.Fragment>
      <Col sm='auto'>
        <AvField name="nbrWeapons" placeHolder="How many ?" type="number" 
        value={this.state.nbrWeapons} onChange={this.onChangeNWeapons}
        validate={{
          required: {value: true, errorMessage: 'Empty/invalid number of weapons. Please enter valid number.'},
          min: {value:this.getMin(),
                errorMessage:`Minimum number of weapons should be "${this.getMin()}".`},
          max: {value:1000, errorMessage: 'Max is 1000'}
        }}
        />
      </Col>
      <Col sm='auto'>
        <AvField type="select" name="weapon" value={this.state.weapon} 
          onChange={this.onChangeWeapon}>
          <option value='Peel/s'>Peel/s</option>                   
          <option value='Bomb/s'>Bomb/s</option>
          <option value='Spinach'>Spinach</option>          
          <option value='Shield/s'>Shield/s</option>
        </AvField>
      </Col>
    </React.Fragment>
    );
  }

  showPayment() {
    return (
    this.state.action == 'register' ?      
      <div>
        <center><b>
          You are registering '<i>{this.state.name}</i>' for Round {this.state.round} and paying {this.state.payment.toFixed(9)} ETH from your {this.state.source}.
        </b></center>
      </div> :
    this.state.action == 'reserve' ?
      <div>
        <center><b>
          You are reserving '<i>{this.state.name}</i>' and paying {this.state.payment.toFixed(9)} ETH from your {this.state.source}.
        </b></center>
      </div> :
     <div>
      <center><b>
        You are buying {this.state.nbrWeapons} {this.state.weapon} for Round {this.state.round} and paying {this.state.payment.toFixed(9)} ETH from your {this.state.source}.
      </b></center>
     </div>

    );
  }

  processAction() {
    this.state.action == 'register' ?
      this.registerRunner() :
    this.state.action == 'reserve' ?    
      this.reserveName() :
    this.buyWeapons()
  }

  render() {

    const { Marethon } = this.props.drizzleState.contracts;
    let regRoundInfo = Marethon.getGameInfo[this.state.regRoundKey];
    let activeRoundInfo = Marethon.getGameInfo[this.state.activeRoundKey];

    if (regRoundInfo && this.props.activeRound == '0' ? true : activeRoundInfo) {
      this.regPeelPrice = regRoundInfo.value[1] != '0' ? 
        (regRoundInfo.value[8]/10**18 + regRoundInfo.value[12]/10**18)*5/FULL_MARETHON/regRoundInfo.value[1] : 0;
      if (this.props.activeRound != '0')
        this.activePeelPrice = activeRoundInfo.value[1] != '0' ? (activeRoundInfo.value[8]/10**18 + activeRoundInfo.value[12]/10**18)*5/FULL_MARETHON/activeRoundInfo.value[1] : 0;
      return (
          <div style={{textAlign:'center', marginTop: '30px', marginBottom:'30px'}}>   
            <h3>What would you like to do?</h3> 
            <AvForm onValidSubmit={() => this.processAction()}>
              <Row>                
                <Col sm={this.state.action == 'reserve' ? { size: 'auto', offset: 3 } : { size: 'auto', offset: 2 }}>
                  <AvField type="select" name="action" value={this.state.action} 
                    onChange={this.onChangeAction}>
                    <option value='register'>Register</option>                   
                    <option value='buy' disabled={this.state.round == this.props.regRound && this.regPeelPrice == 0}>Buy</option>
                    <option value='reserve'>Reserve</option>          
                  </AvField>
                </Col>
                {this.showInput()}
                <Col sm='auto'>
                  <AvField type="select" name="source" value="wallet" value={this.state.source} 
                    onChange={this.onChangeSource}>
                    <option value='wallet'>From Wallet</option>
                    <option value='account'>From Account</option>
                  </AvField>
                </Col>
                { this.state.action != 'reserve' ?
                <Col sm='auto'>
                  <AvField type="select" name="round" value={this.state.round} 
                    onChange={this.onChangeRound}>
                    { this.state.action == 'register' ? <option value={this.props.regRound}>For Registration Round {this.props.regRound}</option> :
                      <React.Fragment>
                        { this.props.activeRound != '0' ? <option value={this.props.activeRound}>For Active Round {this.props.activeRound}</option> :
                          null }
                          <option value={this.props.regRound}>For Register Round {this.props.regRound}</option>
                      </React.Fragment>
                    }
                  </AvField>
                </Col> : null
                }               
                <Col sm='auto'><FormGroup><Button color="danger">Go</Button></FormGroup></Col>
              </Row>
              {this.showPayment()}
            </AvForm>
            <div>{this.getTxStatus()}</div> 
          </div>       
      );
    }
    else
      return <CardTitle>Retrieving Game Info...</CardTitle>;
  }
}

export default WhatToDo;
