import React, { Component } from 'react';
import ActionSelect from '../pages/ActionSelect';
import {CardGroup, CardImg, Card, CardBody, CardTitle, CardSubtitle} from 'reactstrap';
import { FaTrophy, FaFlagCheckered } from 'react-icons/fa';
import {MdAlarmOn} from 'react-icons/md';

class Welcome extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

  render() {
    return (
    	<React.Fragment>
			  <div style={{textAlign:'center', marginTop: '30px', marginBottom:'30px'}}>
					<h1>Welcome To Marethon</h1>
					<h2>The World's First Marathon Game on the BlockChain</h2>
				</div> 
			  
			</React.Fragment>
    );
  }
}

export default Welcome;
