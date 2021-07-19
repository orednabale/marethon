import React from "react";
import { Button, FormGroup, Card, CardTitle} from 'reactstrap';
import { AvForm } from 'availity-reactstrap-validation'

class FeedSpinach extends React.Component {

  constructor(props) {
    super(props);

    this.feedSpinach = this.feedSpinach.bind(this);    
    this.getTxStatus = this.getTxStatus.bind(this);
    this.web3 = this.props.drizzle.web3;
    this.state = {
      stackId: null
    };

  }  

  feedSpinach() {

    const contract = this.props.drizzle.contracts.Marethon;
    
    let _stackId;
    // let drizzle know we want to call the `set` method with `value`

    _stackId = contract.methods["eatSpinach"].cacheSend(
        this.props.params.runner,
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
          <center>You cannot feed {this.props.params.tagName} (Runner {this.props.params.runner}). Round {this.props.params.round} is not active.</center>
          </CardTitle> :   
        this.props.params.onSpinach ?
          <CardTitle className='text-danger'>
          <center>You cannot feed {this.props.params.tagName} (Runner {this.props.params.runner}) in Round {this.props.params.round}. Runner is already on spinach.</center>
          </CardTitle> :
        this.props.params.userSpinach < 1 ? 
          <CardTitle  className='text-danger'>
          <center>You cannot feed {this.props.params.tagName} (Runner {this.props.params.runner}) in Round {this.props.params.round}. You need at least 1 spinach.</center>
          </CardTitle> :   
        <React.Fragment>
          <CardTitle><center>Feed {this.props.params.tagName} (Runner {this.props.params.runner}) in Round {this.props.params.round}</center></CardTitle>
          <AvForm onValidSubmit={() => this.feedSpinach()}>
            <FormGroup className="text-center"><Button color="danger">Feed Spinach</Button></FormGroup>
          </AvForm>
          <div>{this.getTxStatus()}</div> 
        </React.Fragment>
      }
      </Card>
    );
  }
}

export default FeedSpinach;
