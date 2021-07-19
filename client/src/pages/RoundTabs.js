import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, Row, Col,
         ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import RunnerModal from '../pages/RunnerModal';
import SupportModal from '../pages/SupportModal';
import GetRoundInfo from '../getters/GetRoundInfo';
import GetRunners from '../getters/GetRunners';
import GetSupportedRunners from '../getters/GetSupportedRunners';
import GetWeapons from '../getters/GetWeapons';
import GetShares from '../getters/GetShares';

export default class RoundTabs extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
					Round Info
				</NavLink>
			</NavItem>
			<NavItem inverse style={{ backgroundColor: '#0066CC', borderColor: '#0066CC' }}>
				<NavLink
					className={(this.state.activeTab === '2') ? 'active' : ''}				
					onClick={() => { this.toggle('2'); }}
				>
					Runners
				</NavLink>
			</NavItem>
			<NavItem inverse style={{ backgroundColor: '#0066CC', borderColor: '#0066CC' }}>
				<NavLink
					className={(this.state.activeTab === '3') ? 'active' : ''}								
					onClick={() => { this.toggle('3'); }}
				>
					Weapons
				</NavLink>
			</NavItem>		  
			<NavItem inverse style={{ backgroundColor: '#0066CC', borderColor: '#0066CC' }}>
				<NavLink
					className={(this.state.activeTab === '4') ? 'active' : ''}								
					onClick={() => { this.toggle('4'); }}
				>
					Shares
				</NavLink>
			</NavItem>		  
			<NavItem inverse style={{ backgroundColor: '#0066CC', borderColor: '#0066CC' }}>
				<NavLink
					className={(this.state.activeTab === '5') ? 'active' : ''}								
					onClick={() => { this.toggle('5'); }}
				>
					Supported Runners
				</NavLink>
			</NavItem>		  
		</Nav>
        <TabContent activeTab={this.state.activeTab}>
			<TabPane tabId="1">
				<Row>
					<Col>
          			<Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
						<GetRoundInfo drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.props.round}/>
					</Card>
					</Col>
				</Row>	
			</TabPane>
			<TabPane tabId="2">
				<Row>
					<Col>
          			<Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
						<GetRunners drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.props.round}/>
					</Card>
					</Col>
				</Row>
			</TabPane>
			<TabPane tabId="3">
				<Row>
				<Col>
        			<Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>				
						<GetWeapons drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.props.round}/>
					</Card>
				</Col>
				</Row>	
			</TabPane>
			<TabPane tabId="4">
				<Row>
				<Col>
					<Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
					<GetShares drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.props.round}/>				
					</Card>
				</Col>
				</Row>	
			</TabPane>
			<TabPane tabId="5">
				<Row>
				<Col>
				<Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
					<GetSupportedRunners drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} round={this.props.round}/>
				</Card>	
				</Col>
				</Row>
			</TabPane>			
		</TabContent>
      </div>
    );
  }
}
