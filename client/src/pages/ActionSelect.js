
import React from 'react';
import { Button, Input, InputGroup, InputGroupAddon, Col, Row } from 'reactstrap';

export default class ActionSelect extends React.Component {
  constructor(props) {
    super(props);

    this.renderSwitch = this.renderSwitch.bind(this);
    this.renderSwitch2 = this.renderSwitch2.bind(this);
    this.onChangeAction = this.onChangeAction.bind(this);
    this.onChangeWallet = this.onChangeWallet.bind(this);      
    this.onChangeWeapon = this.onChangeWeapon.bind(this);  
    this.onChangeRound = this.onChangeRound.bind(this); 
    this.onChangeName = this.onChangeName.bind(this);  
    this.onChangeNbr = this.onChangeNbr.bind(this);  
    this.showValues = this.showValues.bind(this);  
    this.onClickGo = this.onClickGo.bind(this);
    this.state = {
      chosenAction: 'Register',
      chosenWeapon: 'Bombs',
      choseWallet: 'true',
      chosenName:'',
      chosenNbr:0,
      regRound: 2,
      activeRound: 1,
      chosenRound: 2
    };
  }

  showValues() {
    return ( 
      <ul>
        <li>Action = {this.state.chosenAction}</li>
        <li>Weapon = {this.state.chosenWeapon}</li>
        <li>Wallet = {this.state.choseWallet}</li>      
        <li>Round = {this.state.chosenRound}</li>
        <li>Name = {this.state.chosenName}</li>
        <li>Nbr = {this.state.chosenNbr}</li>
      </ul>          
    );
  }

  onChangeAction(event) {
    this.setState({ chosenAction: event.currentTarget.value })
  }

  onChangeWallet(event) {
    this.setState({ choseWallet: event.currentTarget.value })
  }

  onChangeWeapon(event) {
    this.setState({ chosenWeapon: event.currentTarget.value })
  }

  onChangeName(event) {
    this.setState({ chosenName: event.currentTarget.value })
  }

  onChangeNbr(event) {
    this.setState({ chosenNbr: event.currentTarget.value })
  }

  onChangeRound(event) {
    this.setState({ chosenRound: event.currentTarget.value })
  }

  onClickGo() {
    this.setState({ chosenName: '' });
  }

  renderSwitch() {
    switch (this.state.chosenAction) {
      case 'Register':
      case 'Reserve':
        return (<Input value={this.state.chosenName} onChange={this.onChangeName} placeHolder='What name?' />);
      case 'Buy':
        //{this.setState({ chosenWeapon: 'Bombs' });}
        return (
            <React.Fragment>
            <Input value={this.state.chosenNbr} onChange={this.onChangeNbr} placeHolder='How many?' />
            <select onChange={this.onChangeWeapon} defaultValue ={this.state.chosenWeapon}>
              <option value="Bombs">Bombs</option>
              <option value="Peels">Peels</option>
              <option value="Spinaches">Spinaches</option>
              <option value="Shields">Shields</option>
            </select>
            </React.Fragment>
        );
    }
  }

  renderSwitch2() {
    switch (this.state.chosenAction) {
      case 'Register':
      case 'Reserve':
        return null;
        break;
      case 'Buy':
        return (
            <select onChange={this.onChangeRound} defaultValue ={this.state.chosenRound}>
              <option value={this.state.regRound}>For Registration Round {this.state.regRound}</option>
              { this.state.activeRound != 0 &&
                <option value={this.state.activeRound}>For On-going Round {this.state.activeRound}</option>
              }
            </select>
        );
        break;
    }
  }

  render() {
    return (
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <h3>What would you like to do?</h3>
    			<InputGroup>
    			  <InputGroupAddon addonType="prepend">
      				<select onChange={this.onChangeAction} defaultValue ={this.state.chosenAction} >
      				  <option value="Register">Register</option>
      				  <option value="Buy">Buy</option>
      				  <option value="Reserve">Reserve Name</option>          
      				</select>
            </InputGroupAddon>
    				{this.renderSwitch()}
            <InputGroupAddon addonType="append">        
      				<select onChange={this.onChangeWallet} defaultValue ={this.state.choseWallet}>
      				  <option value='true'>Pay From Your Wallet</option>
      				  <option value='false'>Pay From Your Balance</option>
      				</select>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
    				  {this.renderSwitch2()}
            </InputGroupAddon>
    				<Button style={{backgroundColor:'16e700'}} onClick={() => this.onClickGo() }>Go</Button>
    			</InputGroup>        
          {}
        </Col>
      </Row>
    );
  }
}

