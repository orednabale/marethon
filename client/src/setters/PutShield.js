import React from "react";
import { Button, FormGroup, Card, CardTitle} from 'reactstrap';
import { AvForm, AvField, } from 'availity-reactstrap-validation'

class PutShield extends React.Component {

  constructor(props) {
    super(props);

    this.putShield = this.putShield.bind(this);    
    this.getTxStatus = this.getTxStatus.bind(this);
    this.web3 = this.props.drizzle.web3;
    this.state = {
      stackId: null,
      nShield: 0
    };
  }  

  putShield() {

    const contract = this.props.drizzle.contracts.Marethon;
    
    let _stackId;
    // let drizzle know we want to call the `set` method with `value`

    _stackId = contract.methods["putShield"].cacheSend(
        this.props.params.runner, this.state.nShield,
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

  render() {
    return (
      <Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>  
      { this.props.params.roundStatus != 2 ? 
          <CardTitle className='text-danger'>
          <center>You cannot put shield on {this.props.params.tagName} (Runner {this.props.params.runner}). Round {this.props.params.round} is not active.</center>
          </CardTitle> :
        (this.props.params.xShielded + this.props.params.userShield) * 100 > this.props.params.xBombed * 30 ?
          <CardTitle className='text-danger'>
          <center>Runner can only be shielded 30% of the time from bombs.</center>
          </CardTitle> :        
        <React.Fragment>
        <CardTitle><center>Put Shields on {this.props.params.tagName} (Runner {this.props.params.runner}) in Round {this.props.params.round}</center></CardTitle>
        <AvForm onValidSubmit={() => this.putShield()}>
          <FormGroup className="text-center"><Button color="danger">Put Shields</Button></FormGroup>
          <AvField name="nShield" placeHolder="Enter number of shields to put..." type="number" required 
            value={this.state.nShield}
            onChange={this.onChangeNShield}
            validate={{
                required: {value: true, errorMessage: 'Empty/invalid number of shields. Please enter valid number of shields.'},
                min: {value: 1, errorMessage:'Number of shields must at least be one.'},
                max: {value: this.props.params.userShield, errorMessage: `Number of shields must not be greater than your available shields of "${this.props.params.userShield}".`}
              }
            } 
          />
        </AvForm>
        <div>{this.getTxStatus()}</div> 
        </React.Fragment>
      }
      </Card>
    );
  }
}

export default PutShield;
