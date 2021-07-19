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
      stackId: null,
      withdrawalAmount: 0,
      all: false
    };

  }  

  withdraw() {

    const actualAmount = this.web3.utils.toWei(this.state.withdrawalAmount);
    if (actualAmount == 0)
        return;
    const withdrawAll = this.state.all;
    const contract = this.props.drizzle.contracts.Marethon;
    
    let _stackId;
    // let drizzle know we want to call the `set` method with `value`

    _stackId = contract.methods["withdraw"].cacheSend(
        actualAmount, withdrawAll,
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
    this.setState({ withdrawalAmount: event.currentTarget.value })
  }

  render() {
    const zeroValidation = value => value != 0 ? true : "Withdrawal amount must not be zero."
    return (
      <Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>        
        <CardTitle>Your Account Balance is {this.props.balance} ETH</CardTitle>
        <AvForm onValidSubmit={() => this.withdraw()}>
          <FormGroup className="text-center"><Button color="danger" disabled={this.props.balance == 0}>Withdraw Account Balance</Button></FormGroup>
          <AvField name="amount" placeHolder="Enter amount to withdraw..." type="number" required={!this.state.all} disabled={this.state.all}
            value={this.state.withdrawalAmount}
            onChange={this.onChangeAmount}
            validate={!this.state.all ?
              {
                required: {value: true, errorMessage: 'Empty/invalid withdrawal amount. Please enter valid amount to withdraw.'},
                min: {value: 0, errorMessage:'Withdrawal amount must not be negative.'},
                max: {value: this.props.balance, errorMessage: `Withdrawal amount must not be greater than "${this.props.balance}".`}, 
                zeroValidation
              }
              : {}
            } 
          />
          <AvField type="checkbox" name="withdrawAll" label="Withdraw All" value={this.state.all}
            onClick={() => this.setState(
                            { all: !this.state.all,  
                              withdrawalAmount:!this.state.all ? this.props.balance:''})
            }
          />
        </AvForm>
        <div>{this.getTxStatus()}</div> 
      </Card>

    );
  }
}

export default Withdraw;
