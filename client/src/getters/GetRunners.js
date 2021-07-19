import React from "react";
import {  ListGroup, ListGroupItem, Pagination, PaginationItem, PaginationLink,
          Modal, ModalHeader, ModalBody, ModalFooter, Button,  Card, CardTitle} from 'reactstrap';
import RunnerModal from '../pages/RunnerModal';


class GetRunners extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.getPages = this.getPages.bind(this);
    this.toggleRunnerModal = this.toggleRunnerModal.bind(this);
    this.listClicked = this.listClicked.bind(this);    
    this.state = {
      dataKey: null,
      currentPage: 0,
      activeRunner: 1,
      runnerModalOpen: false
    };
    this.web3 = this.props.drizzle.web3;    
  }
  
  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataPageKey = contract.methods["getRunners"].cacheCall(this.props.round,this.props.drizzleState.accounts[0],this.state.currentPage*10);

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
    const dataPageKey = contract.methods["getRunners"].cacheCall(this.props.drizzleState.accounts[0],index*10);

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

  toggleRunnerModal() {
    this.setState({
      runnerModalOpen: !this.state.runnerModalOpen
    });
  }
  
  listClicked(listId) {
    this.setState({
      runnerModalOpen: !this.state.runnerModalOpen
    });
    this.setState({
      activeRunner: listId
    });   
  }

  render() {
    // get the contract state from drizzleState
    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const runners = Marethon.getRunners[this.state.dataKey];
    // if it exists, then we display its value
	  if (runners) {
      const pagesCount = Math.ceil(runners.value.nRunners / 10);
      if (runners.value.nRunners != 0)
        return (
            <React.Fragment>
            <CardTitle>You have registered the following runners in Round {this.props.round}</CardTitle>                      
            <ListGroup>
              {
                runners.value.runners.map((runner,i) => { 
                    if (runner != 0) 
                      return <ListGroupItem key={i} style={{ backgroundColor: '#778899'}}
                        className={(this.state.activeRunner == runner) ? 'active' : ''}
                        tag="button" onClick={() => {this.listClicked(runner);}}>
                        Runner {runner}</ListGroupItem>
                    else
                      return null;
                }
                )
              }
            </ListGroup>
            <p><i>Click a specific runner to view his info.</i></p>
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
              isOpen={this.state.runnerModalOpen}
              toggle={this.toggleRunnerModal}
              className="modal-lg">
              <ModalHeader toggle={this.toggleRunnerModal}>
                Runner Info for Runner {this.state.activeRunner} in Round {this.props.round}
              </ModalHeader>
              <ModalBody>
                <Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>
                <RunnerModal drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.props.round} runner={this.state.activeRunner}/>
                </Card>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={this.toggleRunnerModal}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>        
            </React.Fragment>        
        );
      else
        return <CardTitle>Nothing to display. You have not registered in any runners in Round {this.props.round}.</CardTitle>
    }
	  else
		  return <CardTitle>Retrieving your runners in Round {this.props.round}...</CardTitle>;
  }
}

export default GetRunners;
