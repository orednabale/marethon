import React from 'react';
import { Card, Button, CardTitle, Row, Col, Table } from 'reactstrap';

export default class SupportModal extends React.Component {

  render() {
    return (
      <div>
		<Row>
		<Col>
		<Card inverse body style={{ backgroundColor: '#3b89d8', borderColor: '#3b89d8' }}>
			<CardTitle>Info on the Runner You Supported</CardTitle>				
			<Row>
				<Col>
				<Table responsive size="sm" style={{ backgroundColor: '#778899'}}>
				<tbody>
					<tr>
					<td style={{textAlign:'right'}}>Round : </td>
					<td><b>{this.props.round}</b></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>Runner : </td>
						<td><b>{this.props.runner}</b></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>Tag Name : </td>
						<td><b>First Runner</b></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>KM Ran : </td>
						<td><b>42.195</b></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>Finish Time: </td>
						<td><b>2018/10/10 12:12:12</b></td>
					</tr>
					</tbody>
					</Table>
					</Col>
					<Col>
					<Table responsive size="sm" style={{ backgroundColor: '#778899'}}>
					<tbody>
					<tr>
						<td style={{textAlign:'right'}}>On Spinach : </td>
						<td><b>No</b></td>
						<td><Button color="danger" size="sm">Give Spinach</Button></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>Shields : </td>
						<td><b>0.00</b></td>
						<td><Button color="danger" size="sm">Put Shields</Button></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>Supporters' % Share : </td>
						<td><b>45%</b></td>
						<td><Button color="danger" size="sm">Set Supporters' Share</Button></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>Supporters : </td>
						<td><b>123</b></td>
					</tr>
					<tr>
						<td style={{textAlign:'right'}}>Enemies : </td>
						<td><b>123.45</b></td>
					</tr>
					</tbody>
				</Table>
				</Col>
			</Row>			
		</Card>				
		<p><i>Click Enemies to see the list and retaliate</i></p>		
		</Col>
		</Row>	
      </div>
    );
  }
}
				
				
				
				
				
				
