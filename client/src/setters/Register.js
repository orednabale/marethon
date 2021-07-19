import React from "react";
import { InputGroup, InputGroupButtonDropdown, 
          DropdownItem, DropdownMenu, DropdownToggle, Button, FormGroup} from 'reactstrap';
import { AvForm, AvField, AvRadio, AvRadioGroup } from 'availity-reactstrap-validation'

class Register extends React.Component {

  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.register = this.register.bind(this);    
    this.getTxStatus = this.getTxStatus.bind(this);
    this.onChangeName = this.onChangeName.bind(this);  
    this.state = {
      dropdownOpen: false,
      stackId: null,
      dateKey: null,
      chosenName: '',
      fromWallet: true
    };
  }  

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataPageKey = contract.methods["getGameInfo"].cacheCall(1);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : dataPageKey });
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  register(fromWallet) {
    const contract = this.props.drizzle.contracts.Marethon;
    let _stackId;
    // let drizzle know we want to call the `set` method with `value`
    if (fromWallet) {
      _stackId = contract.methods["registerFromWal"].cacheSend(
          this.state.chosenName, "aff","0xb619cb0346084c53db2ce2d34795caaafb476267", 
          {from: this.props.drizzleState.accounts[0],value:100000000000000000}
          );
    }
    else {
      _stackId = contract.methods["registerFromBal"].cacheSend(
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

    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    let gameInfo = Marethon.getGameInfo[this.state.dataKey];

    const defaultValues = {
      paySource: "wallet",
      rName: ""
    }

    if (gameInfo) 
      return (      
        <AvForm onValidSubmit={() => this.register(this.state.fromWallet)} model={defaultValues}>
          <FormGroup className="text-center"><Button color="danger" >Register for Round {gameInfo.value[15]}</Button></FormGroup>
          <AvField name="rName" placeHolder="Enter runner name to register..." type="text" required 
            value={this.state.choseName}
            onChange={this.onChangeName}
            validate={
              {
                required: {value: true, errorMessage: 'Please enter a runner name'},
                pattern: {value: '^[a-z0-9 ]+$', errorMessage: 'Runner names must only contain small letters, numbers and spaces in between words'},
                maxLength: {value: 32, errorMessage: 'Runner names must be between 1 and 32 characters'}
              }
            } 
          />
          <AvRadioGroup inline name="paySource" required>
            <AvRadio onClick={() => this.setState({fromWallet: true})} label="Pay From Wallet" value="wallet" />
            <AvRadio onClick={() => this.setState({fromWallet: false})}label="Pay From Account" value="account" />
          </AvRadioGroup>        
          <div>{this.getTxStatus()}</div>
        </AvForm>
      );
    else
      return <div>Retrieving Current Registration Round...</div>;
  }
}

export default Register;
