import React from "react";
import { Button, FormGroup, Card, CardTitle} from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

class SetShare extends React.Component {

  constructor(props) {
    super(props);

    this.setShare = this.setShare.bind(this);    
    this.getTxStatus = this.getTxStatus.bind(this);
    this.web3 = this.props.drizzle.web3;
    this.state = {
      stackId: null,
      pShare: 0
    };
  }  

  setShare() {
    const contract = this.props.drizzle.contracts.Marethon;
    
    let _stackId;
    // let drizzle know we want to call the `set` method with `value`

    _stackId = contract.methods["setSupportersShare"].cacheSend(
        this.props.params.runner, this.state.pShare,
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
          <center>You cannot set percentage shares of {this.props.params.tagName} (Runner {this.props.params.runner}). Round {this.props.params.round} is not active.</center>
          </CardTitle> :   
        <React.Fragment>
        <CardTitle><center>Set Supporters Percentage Share of {this.props.params.tagName} (Runner {this.props.params.runner}) in Round {this.props.params.round}</center></CardTitle>
        <AvForm onValidSubmit={() => this.setShare()}>
          <FormGroup className="text-center"><Button color="danger">Set % Share</Button></FormGroup>
          <AvField name="pShare" placeHolder="Enter number of percentage to set..." type="number" required 
            value={this.state.pShare}
            onChange={this.onChangePShare}
            validate={{
                required: {value: true, errorMessage: 'Empty/invalid percentage share. Please enter valid percentage share.'},
                min: {value: this.props.params.currentShare + 1, errorMessage:`Percentage share must be greater than the current percentage share of "${this.props.params.currentShare}".`},
                max: {value: 99, errorMessage: 'Percentage share should not be greater than 99'},
                pattern: {value: '^[0-9]{1,2}$', errorMessage: 'Only whole numbers are allowed as percentage.'}
              }} 
          />
        </AvForm>
        <div>{this.getTxStatus()}</div> 
        </React.Fragment>
      }
      </Card>
    );
  }
}

export default SetShare;
