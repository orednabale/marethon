					<ListGroup >
						<ListGroupItem style={{ backgroundColor: '#778899'}}>Cras justo odio</ListGroupItem>
						<ListGroupItem style={{ backgroundColor: '#778899'}}>Dapibus ac facilisis in</ListGroupItem>
						<ListGroupItem style={{ backgroundColor: '#778899'}}>Morbi leo risus</ListGroupItem>
						<ListGroupItem style={{ backgroundColor: '#778899'}}>Porta ac consectetur ac</ListGroupItem>
						<ListGroupItem style={{ backgroundColor: '#778899'}}>Vestibulum at eros </ListGroupItem>
					</ListGroup>	



reserve name

						<InputGroup>
						<Input placeholder="Enter new name to reserve..." />
						<InputGroupAddon addonType="append"><Button color="danger" size="sm">Reserve A New Name</Button></InputGroupAddon>					
						</InputGroup>


<Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>			  
					 <CardTitle>Your Account Balance is 
                  <GetVaultBal drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /> ETH
                  </CardTitle>
					<Row>
						<Col sm="6">
							<InputGroup>
								<Input placeholder="Amount" />
								<InputGroupAddon addonType="append">
									<InputGroupText>ETH</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
						</Col>
						<Col sm="6">
							<Button color="danger">Withdraw</Button>
						</Col>
					</Row>
                </Card>



import React, { Component } from 'react';
import {  Button, InputGroup, InputGroupButtonDropdown, 
          DropdownItem, DropdownMenu, DropdownToggle, FormGroup } from 'reactstrap';
import {Label, AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation'

export default class Play extends Component {
  constructor(props) {
    super(props);

    this.onChangeAmount = this.onChangeAmount.bind(this);    
    this.state = {
      stackId: null,
      withdrawalAmount: 0,
      all: false,
      finalAmount: 0
    };
  }  
  onChangeAmount(event) {
    this.setState({ withdrawalAmount: event.currentTarget.value })
  }

  render() {
    return (
       <AvForm onValidSubmit={() => this.setState({finalAmount: this.state.withdrawalAmount})}>
        <FormGroup className="text-center"><Button color="danger" >Withdraw Account Balance</Button></FormGroup>
        <AvField name="amount" placeHolder="Enter amount to withdraw..." type="number" required 
          value={this.state.withdrawalAmount}
          onChange={this.onChangeAmount}
          step={0.000000001}
          validate={
            {
              required: {value: true, errorMessage: 'Please enter amount to withdraw'},
              min: {value: 0, errorMessage: 'More than 10'},
              max: {value: 32, errorMessage: 'Less than 32'}
            }
          } 
        />
        <AvField type="checkbox" name="withdrawAll" label="Withdraw All" value={this.state.all}
        onClick={() => this.setState({all: !this.state.all})}
        />
        <div>Value is {this.state.all ? 'True' : 'False'}</div>
      </AvForm>
      
    )
  }
}



import React, { Component } from 'react';
import {  Button, InputGroup, InputGroupButtonDropdown, 
          DropdownItem, DropdownMenu, DropdownToggle, FormGroup } from 'reactstrap';
import {Label, AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation'

export default class Play extends Component {
  constructor(props) {
    super(props);

    this.onChangeAmount = this.onChangeAmount.bind(this);    
    this.state = {
      stackId: null,
      withdrawalAmount: 0,
      all: false,
      finalAmount: 0
    };
  }  
  onChangeAmount(event) {
    this.setState({ withdrawalAmount: event.currentTarget.value })
  }

  render() {
    return (
       <AvForm onValidSubmit={() => this.setState({finalAmount: this.state.withdrawalAmount})}>
        <FormGroup className="text-center"><Button color="danger" >Withdraw Account Balance</Button></FormGroup>
        <AvField name="amount" placeHolder="Enter amount to withdraw..." type="number" required={!this.state.all} 
          value={this.state.withdrawalAmount}
          onChange={this.onChangeAmount}
          
          validate={
            {
              required: {value: true, errorMessage: 'Please enter amount to withdraw'},
              min: {value: 0, errorMessage: 'More than 10'},
              max: {value: 32, errorMessage: 'Less than 32'}
            }
          } 
        />
        <AvField type="checkbox" name="withdrawAll" label="Withdraw All" value={this.state.all}
        onClick={() => this.setState({all: !this.state.all, })}
        />
        <div>Value is {this.state.finalAmount}, All is {this.state.all?'true':'false'}</div>
      </AvForm>
      
    )
  }
}

import React, { Component } from 'react';
import {  Button, InputGroup, InputGroupButtonDropdown, 
          DropdownItem, DropdownMenu, DropdownToggle, FormGroup } from 'reactstrap';
import {Label, AvForm, AvField, AvGroup, AvInput } from 'availity-reactstrap-validation'

export default class Play extends Component {
  constructor(props) {
    super(props);

    this.onChangeAmount = this.onChangeAmount.bind(this);    
    this.state = {
      stackId: null,
      withdrawalAmount: 0,
      all: false,
      currentBalance: 123,
      tmpAmount: 0
    };
  }  
  onChangeAmount(event) {
    this.setState({ tmpAmount: event.currentTarget.value })
  }

  render() {
    return (
       <AvForm onValidSubmit={() => this.setState({withdrawalAmount: parseFloat(this.state.tmpAmount)})}>
        <FormGroup className="text-center"><Button color="danger" >Withdraw Account Balance</Button></FormGroup>
        <AvField name="amount" placeHolder="Enter amount to withdraw..." type="number" required={!this.state.all} disabled={this.state.all}
          value={this.state.tmpAmount}
          onChange={this.onChangeAmount}
          validate={!this.state.all ?
            {
              required: {value: true, errorMessage: 'Please enter amount to withdraw.'},
              min: {value: 0, errorMessage: 'Amount must not be negative.'}
            } : {}} 
        />
        <AvField type="checkbox" name="withdrawAll" label="Withdraw All" value={this.state.all}
        onClick={() => this.setState({all: !this.state.all, withdrawalAmount : !this.state.all ? this.state.currentBalance:this.state.withdrawalAmount, tmpAmount:!this.state.all ? this.state.currentBalance:this.state.withdrawalAmount})}
        />
        <div>Value is {this.state.withdrawalAmount+100}, All is {this.state.all?'true':'false'}, Tmp amount = {this.state.tmpAmount}, currBal={this.state.currentBalance}</div>
      </AvForm>
      
    )
  }
}




                



import React from "react";
import { InputGroup, InputGroupButtonDropdown, 
         DropdownItem, DropdownMenu, DropdownToggle, Button, FormGroup, Card, CardTitle} from 'reactstrap';
import { AvForm, AvField, AvRadio, AvRadioGroup } from 'availity-reactstrap-validation'

class Withdraw extends React.Component {

  constructor(props) {
    super(props);

    this.withdraw = this.withdraw.bind(this);    
    this.getTxStatus = this.getTxStatus.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);  
    this.web3 = this.props.drizzle.web3;
    this.state = {
      dataKey: null,
      stackId: null,
      withdrawalAmount: 0,
      tmpAmount: 0,
      currentBalance: 0,
      all: false,
      actualAmount: 0
    };

  }  

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const _dataKey = contract.methods["getUserInfo"].cacheCall(this.props.drizzleState.accounts[0]);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : _dataKey });
    //this.setState({currentBalance: this.getAcctBalance()});
  }

  getAcctBalance() {
    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const userInfo = Marethon.getUserInfo[this.state.dataKey];
    // if it exists, then we display its value
  
    if (userInfo) {
      return this.web3.utils.fromWei(userInfo.value.ethBalance);
    }
    else
      return null;
  }

  withdraw() {

    this.setState({withdrawalAmount: parseFloat(this.state.tmpAmount)});
    const contract = this.props.drizzle.contracts.Marethon;
    this.setState({actualAmount : this.web3.utils.toWei(this.state.tmpAmount)});
    const withdrawAll = this.state.all;

    let _stackId;
    // let drizzle know we want to call the `set` method with `value`

    _stackId = contract.methods["withdraw"].cacheSend(
        this.state.actualAmount, withdrawAll,
        {from: this.props.drizzleState.accounts[0]}
    );
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

  onChangeAmount(event) {
    this.setState({ tmpAmount: event.currentTarget.value })
  }

  render() {

    return (
      <Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>        
        <CardTitle>Your Account Balance is {this.getAcctBalance()} ETH</CardTitle>
        <AvForm onValidSubmit={() => this.withdraw()}>
          <FormGroup className="text-center"><Button color="danger" >Withdraw Account Balance</Button></FormGroup>
          <AvField name="amount" placeHolder="Enter amount to withdraw..." type="number" required={!this.state.all} disabled={this.state.all}
            value={this.state.tmpAmount}
            onChange={this.onChangeAmount}
            validate={!this.state.all ?
              {
                required: {value: true, errorMessage: 'Please enter amount to withdraw.'},
                min: {value: 0, errorMessage: 'Amount must not be negative.'}
              } : {}} 
          />
          <AvField type="checkbox" name="withdrawAll" label="Withdraw All" value={this.state.all}
            onClick={() => this.setState(
                            { all: !this.state.all, 
                              withdrawalAmount : !this.state.all ? this.getAcctBalance():this.state.withdrawalAmount, 
                              tmpAmount:!this.state.all ? this.getAcctBalance():0})
            }
          />
        </AvForm>
        <div>{this.getTxStatus()}</div> 
        <div>All : {this.state.all?'true':'false'}, Amount: {this.state.withdrawalAmount}, TmpAmount : {this.state.tmpAmount}, Actual: {this.state.actualAmount}</div>
      </Card>

    )
  }
}

export default Withdraw;
                