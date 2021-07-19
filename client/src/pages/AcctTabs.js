import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, Row, Col,
         Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import GetVaultBal from '../getters/GetVaultBal';
import GetReservedNames from '../getters/GetReservedNames';
import ReserveName from '../setters/ReserveName';
import Withdraw from '../setters/Withdraw';

export default class AcctTabs extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.getAcctBalance = this.getAcctBalance.bind(this);
    this.web3 = this.props.drizzle.web3;
    this.state = {
      activeTab: '2',
      dataKey: null
    };
  }

  componentDidMount() {
    const { drizzle } = this.props;
    const contract = drizzle.contracts.Marethon;

    // let drizzle know we want to watch the `myString` method
    const _dataKey = contract.methods["getUserInfo"].cacheCall(this.props.drizzleState.accounts[0]);

    // save the `dataKey` to local component state for later reference
    this.setState({ dataKey : _dataKey });
  }

  toggle(tab) {
    this.setState({
        activeTab: tab
      });
  }

  getAcctBalance() {
    const { Marethon } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const userInfo = Marethon.getUserInfo[this.state.dataKey];
    // if it exists, then we display its value
  
    if (userInfo) {
      return this.web3.utils.fromWei(userInfo.value.ethBalance);
    }
    else
      return null;
  }
  
  render() {
    return (
      <div>
        <Nav pills>
          <NavItem inverse style={{ backgroundColor: '#0066CC', borderColor: '#0066CC' }}>
            <NavLink
				className={(this.state.activeTab === '1') ? 'active' : ''}			
				onClick={() => { this.toggle('1'); }}
            >
              Balance
            </NavLink>
          </NavItem>
          <NavItem inverse style={{ backgroundColor: '#0066CC', borderColor: '#0066CC' }}>
            <NavLink
				className={(this.state.activeTab === '2') ? 'active' : ''}			
				onClick={() => { this.toggle('2'); }}
            >
              Reserved Names
            </NavLink>
          </NavItem>
		  </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
				        <Withdraw drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} balance={this.getAcctBalance()}/>      
              </Col>
			      </Row>	
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
                  <GetReservedNames  drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
        					<div className="d-flex justify-content-center pt-4">	
                    <ReserveName drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} balance={this.getAcctBalance()}/>
        					</div>
                </Card>
              </Col>
            </Row>
          </TabPane>
		  </TabContent>
      </div>
    );
  }
}
