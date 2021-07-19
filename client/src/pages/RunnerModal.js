import React from 'react';
import { Card, Button, CardTitle, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledAlert } from 'reactstrap';
import FeedSpinach from '../setters/FeedSpinach';
import PutShield from '../setters/PutShield';
import SetShare from '../setters/SetShare';
//import Retaliate from '../pages/Retaliate';

export default class RunnerModal extends React.Component {

  constructor(props) {
    super(props);
    this.web3 = this.props.drizzle.web3;
	this.toggleFeedSpinach = this.toggleFeedSpinach.bind(this);    
	this.togglePutShield = this.togglePutShield.bind(this);	
	this.toggleSetShare = this.toggleSetShare.bind(this);
	this.toggleRetaliate = this.toggleRetaliate.bind(this);
    this.state = {
      runnerInfoKey: null,
      supportersKey: null,
      enemiesKey: null,
      gameInfoKey: null,
      userRoundKey: null
    };
  }  

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;
    // let drizzle know we want to watch the `myString` method
    const _runnerInfoKey = contract.methods["getRunnerInfo"].cacheCall(this.props.round, this.props.runner);
    const _supportersKey = contract.methods["getSupporters"].cacheCall(this.props.round, this.props.runner, 0);
    const _enemiesKey = contract.methods["getEnemies"].cacheCall(this.props.round, this.props.runner,0);
    const _gameInfoKey = contract.methods["getGameInfo"].cacheCall(this.props.round);
    const _userRoundKey = contract.methods["getUserRoundInfo"].cacheCall(this.props.drizzleState.accounts[0],this.props.round);
    // save the `dataKey` to local component state for later reference
    this.setState({ runnerInfoKey : _runnerInfoKey });
    this.setState({ supportersKey : _supportersKey });
    this.setState({ enemiesKey : _enemiesKey });
    this.setState({ gameInfoKey : _gameInfoKey });
    this.setState({ userRoundKey : _userRoundKey });    
  }

  toggleFeedSpinach() {
    this.setState({
      feedSpinachOpen: !this.state.feedSpinachOpen
    });
  }

  togglePutShield() {
    this.setState({
      putShieldOpen: !this.state.putShieldOpen
    });
  }

  toggleSetShare() {
    this.setState({
      setShareOpen: !this.state.setShareOpen
    });
  }

  toggleRetaliate() {
    this.setState({
      retaliateOpen: !this.state.retaliateOpen
    });
  }

  render() {

    const { Marethon } = this.props.drizzleState.contracts;

    let runnerInfo = Marethon.getRunnerInfo[this.state.runnerInfoKey];
    let supporters = Marethon.getSupporters[this.state.supportersKey];
    let enemies = Marethon.getEnemies[this.state.enemiesKey];
    let gameInfo = Marethon.getGameInfo[this.state.gameInfoKey];
    let userRound = Marethon.getUserRoundInfo[this.state.userRoundKey];

    if (runnerInfo && supporters && enemies && gameInfo && userRound) {

	    return (
	      <React.Fragment>
				<CardTitle>Your Runner Info</CardTitle>				
				<Row>
					<Col>
					<Table responsive size="sm" style={{ backgroundColor: '#778899'}}>
					<tbody>
						<tr>
						<td style={{textAlign:'right'}}>Round : </td>
						<td><b>{this.props.round} - {	gameInfo.value[0] == 0 ? 'Not yet started' :
														gameInfo.value[0] == 1 ? 'Registration' :
														gameInfo.value[0] == 2 ? 'On Going' :
														gameInfo.value[0] == 3 ? 'Game Ended' :
														'Game Closed' }</b></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>Runner : </td>
							<td><b>{this.props.runner}</b></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>Tag Name : </td>
							<td><b>{this.web3.utils.toAscii(runnerInfo.value.tagName)}</b></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>KM Ran : </td>
							<td><b>{runnerInfo.value.runData[0]}</b></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>Finish Time: </td>
							<td><b>{runnerInfo.value.runData[3]}</b></td>
						</tr>
						</tbody>
						</Table>
						</Col>
						<Col>
						<Table responsive size="sm" style={{ backgroundColor: '#778899'}}>
						<tbody>
						<tr>
							<td style={{textAlign:'right'}}>On Spinach : </td>
							<td><b>{runnerInfo.value.onSpinach ? 'Yes' : 'No'}</b></td>
							<td><Button color="danger" size="sm" onClick={this.toggleFeedSpinach}>Feed Spinach</Button></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>Shields : </td>
							<td><b>{runnerInfo.value.runData[9]}</b></td>
							<td><Button color="danger" size="sm" onClick={this.togglePutShield}>Put Shields</Button></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>Supporters' % Share : </td>
							<td><b>{runnerInfo.value.runData[4]}</b></td>
							<td><Button color="danger" size="sm" onClick={this.toggleSetShare}>Set Supporters'  % Share</Button></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>Supporters : </td>
							<td><b>{supporters.value.nSupporters}</b></td>
						</tr>
						<tr>
							<td style={{textAlign:'right'}}>Enemies : </td>
							<td><b>{enemies.value.nEnemies}</b></td>
							<td><Button color="danger" size="sm" onClick={this.toggleRetaliate}>Retaliate</Button></td>
						</tr>
						</tbody>
					</Table>

					</Col>
				</Row>
	            <Modal 
	              isOpen={this.state.feedSpinachOpen}
	              toggle={this.toggleFeedSpinach}>
	              <ModalBody>
	                <Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>
	                <FeedSpinach drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} 
	                			 params={{round: this.props.round,
	                			 		  runner: this.props.runner,
	                			 		  onSpinach: runnerInfo.value.onSpinach,
	                			 		  roundStatus: gameInfo.value[0],
	                			 		  userSpinach: userRound.value.nSpinach/10**18,
	                			 		  tagName: this.web3.utils.toAscii(runnerInfo.value.tagName) }}
	                />
	                </Card>
	              </ModalBody>
	              <ModalFooter>
	                <Button color="danger" onClick={this.toggleFeedSpinach}>
	                  Close
	                </Button>
	              </ModalFooter>
	            </Modal>        
	            <Modal 
	              isOpen={this.state.putShieldOpen}
	              toggle={this.togglePutShield}>
	              <ModalBody>
	                <Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>
	                <PutShield drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} 
	                		   params={{round: this.props.round,
	                			 		runner: this.props.runner,
	                			 		roundStatus: gameInfo.value[0],
	                			 		userShield: userRound.value.nShield/10**18,
	                			 		xShielded: runnerInfo.value.runData[6]/10**18,
	                			 		xBombed: runnerInfo.value.runData[7]/10**18,
	                			 		tagName: this.web3.utils.toAscii(runnerInfo.value.tagName) }}
	                />
	                </Card>
	              </ModalBody>
	              <ModalFooter>
	                <Button color="danger" onClick={this.togglePutShield}>
	                  Close
	                </Button>
	              </ModalFooter>
	            </Modal>        
	            <Modal 
	              isOpen={this.state.setShareOpen}
	              toggle={this.toggleSetShare}>
	              <ModalBody>
	                <Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>
	                <SetShare drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} 
	                		  params={{round: this.props.round,
	                			 	   runner: this.props.runner,
	                			 	   roundStatus: gameInfo.value[0],
	                			 	   currentShare: runnerInfo.value.runData[4], 
	                			 	   tagName: this.web3.utils.toAscii(runnerInfo.value.tagName)}}
	                />
	                </Card>
	              </ModalBody>
	              <ModalFooter>
	                <Button color="danger" onClick={this.toggleSetShare}>
	                  Close
	                </Button>
	              </ModalFooter>
	            </Modal>        
	      </React.Fragment>
	    );
	} else
      return <CardTitle>Retrieving Runner Info...</CardTitle>;
  }
}
				
				
				
				
				
				
