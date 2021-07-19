import React from "react";
import { InputGroup, InputGroupButtonDropdown, 
          DropdownItem, DropdownMenu, DropdownToggle, Button, FormGroup} from 'reactstrap';
import { AvForm, AvField, AvRadio, AvRadioGroup } from 'availity-reactstrap-validation'

class ReserveName extends React.Component {

  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.reserveName = this.reserveName.bind(this);    
    this.getTxStatus = this.getTxStatus.bind(this);
    this.onChangeName = this.onChangeName.bind(this); 
    this.web3 = this.props.drizzle.web3; 
    this.state = {
      dropdownOpen: false,
      stackId: null,
      chosenName: '',
      fromWallet: true
    };
  }  

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  reserveName(fromWallet) {
    const contract = this.props.drizzle.contracts.Marethon;
    let _stackId;
    // let drizzle know we want to call the `set` method with `value`
    if (fromWallet) {
      _stackId = contract.methods["reserveNameFromWal"].cacheSend(
          this.state.chosenName, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0],value:100000000000000000}
          );
    }
    else {
      _stackId = contract.methods["reserveNameFromBal"].cacheSend(
          this.state.chosenName, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0]}
          );
    }
    // save the `stackId` for later reference
    this.setState({ stackId: _stackId }); 
    this.setState({ chosenName: '' });       
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
              Click link to monitor tranction in Etherscan.
          </center>
        </p>
      </div>
    );
  };

  onChangeName(event) {
    this.setState({ chosenName: event.currentTarget.value })
  }

  render() {
    const defaultValues = {
      paySource: "wallet",
      rName: ""
    }

    return (
      <AvForm onValidSubmit={() => this.reserveName(this.state.fromWallet)} model={defaultValues}>
        <FormGroup className="text-center"><Button color="danger" >Reserve Name</Button></FormGroup>
        <AvField name="rName" placeHolder="Enter a name to reserve..." type="text" required 
          value={this.state.choseName}
          onChange={this.onChangeName}
          validate={
            {
              required: {value: true, errorMessage: 'Please enter a name'},
              pattern: {value: '^[a-z0-9 ]+$', errorMessage: 'Reserve names must only contain small letters, numbers and spaces in between words'},
              maxLength: {value: 32, errorMessage: 'Reserve names must be between 1 and 32 characters'}
            }
          } 
        />
        <AvRadioGroup inline name="paySource" required>
          <AvRadio onClick={() => this.setState({fromWallet: true})} label="Pay From Wallet" value="wallet" />
          <AvRadio onClick={() => this.setState({fromWallet: false})} label="Pay From Account" value="account" 
            disabled={this.props.balance < 0.1} />
        </AvRadioGroup>        
        <div>{this.getTxStatus()}</div>
      </AvForm>
    )
  }
}

export default ReserveName;
