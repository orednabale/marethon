import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

import AcctTabs from './AcctTabs';
import RaceTabs from './RaceTabs';

class Header extends Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.setActiveLink = this.setActiveLink.bind(this);    
		this.state = {
		  isOpen: false,
		  activeLink: 'home'
		};
	}

	toggle() {
		this.setState({
		  isOpen: !this.state.isOpen
		});
	}

	toggleRaceModal = () => {
		this.setState({
			raceModalOpen: !this.state.raceModalOpen
		});
	}

	toggleAcctModal = () => {
		this.setState({
			acctModalOpen: !this.state.acctModalOpen
		});
	}
  
	setActiveLink(link) {
		this.setState({
		  activeLink: link
		});
	}

  render() {
    return (
		<div>
			<Navbar color="success" inverse toggleable expand="sm" dark>
			<NavbarToggler onClick={this.toggle}/>
			<NavbarBrand  onClick={() => { this.setActiveLink('home'); }} href="#">Marethon</NavbarBrand>
			<Collapse isOpen={this.state.isOpen} navbar>			
			<Nav className="ml-auto" navbar>
				<NavItem className={(this.state.activeLink === 'account') ? 'active' : ''}>
					<NavLink onClick={() => { this.setActiveLink('account'); this.toggleAcctModal(); }} href="#">Your Account</NavLink>
				</NavItem>
				<Modal 
					isOpen={this.state.acctModalOpen}
					toggle={this.toggleAcctModal}
					className="modal-lg">
					<ModalHeader toggle={this.toggleAcctModal}>
					Your Account
					</ModalHeader>
					<ModalBody>
						<AcctTabs drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
					</ModalBody>
					<ModalFooter>
						<Button
						  color="danger"
						  onClick={this.toggleAcctModal}>
						  Close
						</Button>
					</ModalFooter>
				</Modal>			

				<NavItem className={(this.state.activeLink === 'races') ? 'active' : ''}>
					<NavLink onClick={() => { this.setActiveLink('races'); this.toggleRaceModal(); }} href="#">Your Race/s</NavLink>				
				</NavItem>
				<Modal 
					isOpen={this.state.raceModalOpen}
					toggle={this.toggleRaceModal}
					className="modal-lg">
					<ModalHeader toggle={this.toggleRaceModal}>
					Your Race/s
					</ModalHeader>
					<ModalBody>
						<RaceTabs drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
					</ModalBody>
					<ModalFooter>
						<Button
							color="danger"
							onClick={this.toggleRaceModal}>
							Close
						</Button>
					</ModalFooter>
				</Modal>						
			</Nav>		            
			</Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
