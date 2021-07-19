import React from "react";
import { ListGroup, ListGroupItem, Pagination, PaginationItem, PaginationLink, CardTitle } from 'reactstrap';
import PropTypes from 'prop-types';

class GetReservedNames extends React.Component {

  constructor(props) {
    super(props);

    // this.toggle = this.toggle.bind(this);
    this.state = {
      dataKey: null,
      currentPage: 0
    };
    this.web3 = this.props.drizzle.web3;    
  }
  
  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const dataPageKey = contract.methods["getReservedNames"].cacheCall(this.props.drizzleState.accounts[0],this.state.currentPage*10);

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
    const dataPageKey = contract.methods["getReservedNames"].cacheCall(this.props.drizzleState.accounts[0],index*10);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : dataPageKey });
    
  }

  getPages (pagesCount) {
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

  render() {
    // get the contract state from drizzleState
    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const reservedNames = Marethon.getReservedNames[this.state.dataKey];
    // if it exists, then we display its value
	  if (reservedNames) {
      const pagesCount = Math.ceil(reservedNames.value.nNames / 10);
      if (reservedNames.value.nNames != 0)
        return (
          <React.Fragment>
          <CardTitle>You have reserved the following names :</CardTitle>
          <ListGroup >
          {
            reservedNames.value.names.map((name,i) => { 
                if (name != 0) 
                  return <ListGroupItem key={i} style={{ backgroundColor: '#778899'}}>
                    {this.web3.utils.toAscii(name)}</ListGroupItem>
                else
                  return null;
            }
            )
          }
          </ListGroup>         
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
          </React.Fragment>
        );
      else
        return <CardTitle>Nothing to display. You have not reserved any names.</CardTitle>;  
    }
	  else
		  return <CardTitle>Retrieving your reserved names...</CardTitle>;
  }
}

export default GetReservedNames;
