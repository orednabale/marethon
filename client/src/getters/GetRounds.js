import React from "react";
import {  ListGroup, ListGroupItem, Pagination, PaginationItem, PaginationLink,
          Modal, ModalHeader, ModalBody, ModalFooter, Button, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';
import RoundTabs from '../pages/RoundTabs'

class GetRounds extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.getPages = this.getPages.bind(this);
    this.toggleRoundModal = this.toggleRoundModal.bind(this);
    this.listClicked = this.listClicked.bind(this);    
    this.state = {
      dataKey: null,
      currentPage: 0,
      activeRound: 1,
      roundModalOpen: false
    };
    this.web3 = this.props.drizzle.web3;    
  }
  
  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataPageKey = contract.methods["getRounds"].cacheCall(this.props.drizzleState.accounts[0],this.state.currentPage*10);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : dataPageKey });
  }

  handleClick(e, index) {
    
    e.preventDefault();

    this.setState({
      currentPage: index,
      dataKey: null
    });
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;
    const dataPageKey = contract.methods["getRounds"].cacheCall(this.props.drizzleState.accounts[0],index*10);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : dataPageKey });
    
  }

  getPages(pagesCount) {
    let pages = [];
    for (let i = 0; i < pagesCount; i++) {
      pages.push(
      <PaginationItem active={i === this.state.currentPage} key={i}>
        <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
          {i + 1}
        </PaginationLink>
      </PaginationItem>
      );
    }
    return pages;
  }

  toggleRoundModal() {
    this.setState({
      roundModalOpen: !this.state.roundModalOpen
    });
  }
  
  listClicked(listId) {
    this.setState({
      roundModalOpen: !this.state.roundModalOpen
    });
    this.setState({
      activeRound: listId
    });   
  }
 
  render() {
    // get the contract state from drizzleState
    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const rounds = Marethon.getRounds[this.state.dataKey];
    // if it exists, then we display its value
	  if (rounds) {
      const pagesCount = Math.ceil(rounds.value.nRounds / 10);
      if (rounds.value.nRounds != 0)
        return (
          <React.Fragment>
          <CardTitle>You have participated in the following rounds :</CardTitle>
          <ListGroup >
          {
            rounds.value.rounds.map((round,i) => { 
                if (round != 0) 
                  return <ListGroupItem key={i} style={{ backgroundColor: '#778899'}}
                    className={(this.state.activeRound == round) ? 'active' : ''}
                    tag="button" onClick={() => {this.listClicked(round);}}>
                    Round {round}</ListGroupItem>
                else
                  return null;
            }
            )
          }
          </ListGroup>
          <p><i>Click a specific round to view your runners, weapons and shares.</i></p>
          <div className="mx-auto">
          { pagesCount == 1 ? '' :
          <Pagination>      
            <PaginationItem disabled={this.state.currentPage <= 0}>      
              <PaginationLink
                onClick={e => this.handleClick(e, this.state.currentPage - 1)}
                previous
                href="#"
              />
            </PaginationItem>

            {this.getPages(pagesCount)} 

            <PaginationItem disabled={this.state.currentPage >= pagesCount - 1}>      
              <PaginationLink
                    onClick={e => this.handleClick(e, this.state.currentPage + 1)}
                    next
                    href="#"
                  />        
            </PaginationItem>            
          </Pagination>        
          }
          </div>
          <Modal 
            isOpen={this.state.roundModalOpen}
            toggle={this.toggleRoundModal}
            className="modal-lg" >
            <ModalHeader>
            Your Runners, Weapons and Shares in Round {this.state.activeRound}
            </ModalHeader>
            <ModalBody>
            <RoundTabs drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.state.activeRound}/>
            </ModalBody>
            <ModalFooter>
            <Button
              color="danger"
              onClick={this.toggleRoundModal}>
              Close
            </Button>
            </ModalFooter>            
          </Modal>          
          </React.Fragment>
        );
      else
        return <CardTitle>Nothing to display. You have not participated in any rounds yet.</CardTitle>;  
    }
	  else
		  return <CardTitle>Retrieving your races/rounds...</CardTitle>;
  }
}

export default GetRounds;
