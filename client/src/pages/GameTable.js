import React, { Component } from 'react';
import { FaFlag } from 'react-icons/fa';
import { MdPersonPin, MdAlarmOn } from 'react-icons/md';
import { 	PaginationItem, PaginationLink, Row, Col, Card, CardHeader, CardBody, 
					Table, Pagination, CardTitle} from 'reactstrap';
import GameItem from '../pages/GameItem';

const FULL_MARETHON = 3600;

const FIRST = 0;
const PREV = 1;
const NEXT = 2;
const LAST = 3;
const ENT_PERPAGE = 2;

class GameTable extends Component {

  constructor(props) {
    super(props);

    // this.toggle = this.toggle.bind(this);
    this.state = {
      pageKey: null,
      gameInfoKey: null,
      firstRunner: 0,
      lastRunner: 0,
      whichPage: FIRST
    };
    this.web3 = this.props.drizzle.web3;    
  }
  
  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const _gameInfoKey = contract.methods["getGameInfo"].cacheCall(this.props.activeRound);
    const _firstPageKey = contract.methods["get1stLastPage"].cacheCall(this.props.activeRound,ENT_PERPAGE,0);
    // save the `dataKey` to local component state for later reference
    this.setState({ pageKey : _firstPageKey });
    this.setState({ gameInfoKey : _gameInfoKey });
  }

  pageClick(_whichPage, fromRunner=null) {

    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;
    let dataPageKey;

    if (fromRunner == '0') {  
    	if (_whichPage == NEXT)	_whichPage = LAST;
    	if (_whichPage == PREV) _whichPage = FIRST;
    }

    _whichPage == FIRST ?
    	dataPageKey = contract.methods["get1stLastPage"].cacheCall(this.props.activeRound, ENT_PERPAGE, 0) :
    _whichPage == LAST ? 
    	dataPageKey = contract.methods["get1stLastPage"].cacheCall(this.props.activeRound, ENT_PERPAGE, 1) :       	
    _whichPage == PREV ? 
    	dataPageKey = contract.methods["getPrevNextPage"].cacheCall(this.props.activeRound, parseInt(fromRunner.slice(-13).slice(0,9)), ENT_PERPAGE, 0) :       	 
    	dataPageKey = contract.methods["getPrevNextPage"].cacheCall(this.props.activeRound, parseInt(fromRunner.slice(-13).slice(0,9)), ENT_PERPAGE, 1)      	

    // save the `dataKey` to local component state for later reference
    this.setState({ pageKey : dataPageKey });
    this.setState({ whichPage : _whichPage });
  }

  render() {

  		let currentPage;

	    const { Marethon } = this.props.drizzleState.contracts;
 
	    // using the saved `dataKey`, get the variable we're interested in
	    currentPage = this.state.whichPage == FIRST ?
	    								Marethon.get1stLastPage[this.state.pageKey] :
	    							this.state.whichPage == LAST ?
	    								Marethon.get1stLastPage[this.state.pageKey] :
	    							this.state.whichPage == NEXT ?
	    								Marethon.getPrevNextPage[this.state.pageKey] :
	    							this.state.whichPage == PREV ?
	    								Marethon.getPrevNextPage[this.state.pageKey] : null

	    const gameInfo = Marethon.getGameInfo[this.state.gameInfoKey];
	    // if it exists, then we display its value

	    if (gameInfo && currentPage) {
				const len = currentPage.value.runners.indexOf('0');
				const actualPage = currentPage.value.runners.slice(0, len == -1 ? currentPage.value.runners.length : len);
	    	const peelPrice = gameInfo.value[1] != '0' ? (gameInfo.value[8]/10**18 + gameInfo.value[12]/10**18)*5/FULL_MARETHON/gameInfo.value[1] : 0;
				return (
	        <Row>
	          <Col md="9" sm="6" xs="12">
	            <Card>
	              <CardHeader><h5>Leader Board</h5></CardHeader>
	              <CardBody>
									<Table responsive hover>
										<thead>
											<tr className="text-capitalize align-middle text-center">
												<th>#</th>
				                <th><MdPersonPin size={25} /></th>
				                <th>Tag Name</th>
				                <th><FaFlag size={25} /></th>
												<th>Owner</th>
											</tr>
										</thead>
										<tbody>
	            			{
					  					actualPage.length != 0 ? (
												this.state.whichPage == PREV || this.state.whichPage == LAST ? actualPage.reverse() : null,
												actualPage.map((runner, index) => (
													<GameItem key={runner.slice(-13).slice(0,9)} runner={runner.slice(-13).slice(0,9)} { ...this.props } />
												)) 						
											)	: this.state.whichPage == PREV ? this.pageClick(FIRST)
												: this.state.whichPage == NEXT ? this.pageClick(LAST)
												: <tr>Nothing to display. Nobody registered</tr>
	            			}
	            			</tbody>
									</Table>
				          <div className="mx-auto"><center>
				          { gameInfo.value[1] > ENT_PERPAGE ? 
					          <Pagination>
								      <PaginationItem active={this.state.whichPage == FIRST || (actualPage.length < ENT_PERPAGE && this.state.whichPage == PREV)}>
								        <PaginationLink onClick={e => this.pageClick(FIRST)}>
								          First
								        </PaginationLink>
								      </PaginationItem>
								      <PaginationItem active={this.state.whichPage == PREV && actualPage.length == ENT_PERPAGE} 
								      	disabled={this.state.whichPage == FIRST || (actualPage.length < ENT_PERPAGE && this.state.whichPage == PREV)}>
								        <PaginationLink onClick={e => this.pageClick(PREV,actualPage.length ? actualPage[0] : '0')}>
								          Prev
								        </PaginationLink>
								      </PaginationItem>
								      <PaginationItem active={this.state.whichPage == NEXT && actualPage.length == ENT_PERPAGE} 
								      	disabled={this.state.whichPage == LAST || (actualPage.length < ENT_PERPAGE && this.state.whichPage == NEXT)}>
								        <PaginationLink onClick={e => this.pageClick(NEXT,actualPage.length ? actualPage[actualPage.length-1] : '0')}>
								          Next
								        </PaginationLink>
								      </PaginationItem>
								      <PaginationItem active={this.state.whichPage == LAST || (actualPage.length < ENT_PERPAGE && this.state.whichPage == NEXT)}>
								        <PaginationLink onClick={e => this.pageClick(LAST)}>
								          Last
								        </PaginationLink>
								      </PaginationItem>
								    </Pagination>
										 : ''       
				          }
				          </center></div>
	              </CardBody>
	            </Card>
			  		</Col>
				
	          <Col md="3" sm="6" xs="12">
							<Card>
								<div style={{backgroundColor:'#ededed', textAlign:'center'}}>Game Round Info</div>
								<Table responsive size="sm" >
									<tbody>
										<tr>
											<td style={{textAlign:'right'}}>Round : </td>
											<td><b>{this.props.activeRound}</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Status : </td>
											<td><b>On-going</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Race Start : </td>
											<td><b>{(gameInfo.value[4] == '0' ? 'Race starts a week after Active Round ends' : 
													(new Date(gameInfo.value[4]*1000)).toUTCString())}</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Peel Price : </td>
											<td><b>{peelPrice.toFixed(9)} ETH</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Bomb Price : </td>
											<td><b>{(peelPrice * 7).toFixed(9)} ETH</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Spinach Price : </td>
											<td><b>{(peelPrice * 15).toFixed(9)} ETH</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Shield Price : </td>
											<td><b>{(peelPrice * 10).toFixed(9)} ETH</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Total Pot : </td>
											<td><b>{(gameInfo.value[8]/10**18).toFixed(9)} ETH</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>User's Pot : </td>
											<td><b>{(gameInfo.value[9]/10**18).toFixed(9)} ETH</b></td>
										</tr>
										<tr>
											<td style={{textAlign:'right'}}>Number of Runners : </td>
											<td><b>{gameInfo.value[1]}</b></td>
										</tr>
									</tbody>
								</Table>
							</Card>
			  		</Col>
	    		</Row>
	    	);	
			} else return	<Card><CardTitle>Retrieving Game Table...</CardTitle></Card>;
		}	
	}

export default GameTable;