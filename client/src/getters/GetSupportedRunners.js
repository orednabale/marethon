import React from "react";
import {  ListGroup, ListGroupItem, Pagination, PaginationItem, PaginationLink,
          Modal, ModalHeader, ModalBody, ModalFooter, Button,  Card, CardTitle} from 'reactstrap';
import SupportModal from '../pages/SupportModal';


class GetSupportedRunners extends React.Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.getPages = this.getPages.bind(this);
    this.toggleSupportModal = this.toggleSupportModal.bind(this);
    this.listClicked = this.listClicked.bind(this);    
    this.state = {
      dataKey: null,
      currentPage: 0,
      activeSupport: 0,
      supportModalOpen: false
    };
    this.web3 = this.props.drizzle.web3;    
  }
  
  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataPageKey = contract.methods["getSupportedRunners"].cacheCall(this.props.round,this.props.drizzleState.accounts[0],this.state.currentPage*10);

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
    const dataPageKey = contract.methods["getSupportedRunners"].cacheCall(this.props.drizzleState.accounts[0],index*10);

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

  toggleSupportModal() {
    this.setState({
      supportModalOpen: !this.state.supportModalOpen
    });
  }
  
  listClicked(listId) {
    this.setState({
      supportModalOpen: !this.state.supportModalOpen
    });
    this.setState({
      activeSupport: listId
    });   
  }

  render() {
    // get the contract state from drizzleState
    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const runners = Marethon.getSupportedRunners[this.state.dataKey];
    // if it exists, then we display its value
	  if (runners) {
      const pagesCount = Math.ceil(runners.value.nRunners / 10);
      if (runners.value.nRunners != 0)
        return (
            <React.Fragment>
            <CardTitle>You have supported the following runners in Round {this.props.round}</CardTitle>
            <ListGroup>
              {
                runners.value.runners.map((runner,i) => { 
                    if (runner != 0) 
                      return <ListGroupItem key={i} style={{ backgroundColor: '#778899'}}
                        className={(this.state.activeSupport == runner) ? 'active' : ''}
                        tag="button" onClick={() => {this.listClicked(runner);}}>
                        Runner {runner} - {runners.value.nRunners} {runners.value.retCode} - </ListGroupItem>
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
              isOpen={this.state.supportModalOpen}
              toggle={this.toggleSupportModal}
              className="modal-lg">
              <ModalHeader toggle={this.toggleSupportModal}>
                Runner Info for Runner {this.state.activeSupport} in Round {this.props.round}
              </ModalHeader>
              <ModalBody>
                <SupportModal drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.props.round} runner={this.state.activeSupport}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={this.toggleSupportModal}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>                
           </React.Fragment>
        );
      else
        return <CardTitle>Nothing to display. You have not supported in any runners in Round {this.props.round}.</CardTitle>;  
    }
	  else
		  return <CardTitle>Retrieving runners you supported in Round {this.props.round}...</CardTitle>;
  }
}

export default GetSupportedRunners;
