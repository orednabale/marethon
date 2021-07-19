import React from 'react';
import { Card, Button, CardTitle, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import GetRounds from '../getters/GetRounds';
import Register from '../setters/Register';

export default class RaceTabs extends React.Component {
  constructor(props) {
    super(props);
  }

  
  render() {
    return (
      <div>
            <Row>
              <Col sm="12">
                <Card inverse body style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
        				  <GetRounds drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
                  <div className="d-flex justify-content-center pt-4">	
                    	<Register drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
                  </div>					
                </Card>
              </Col>
            </Row>
      </div>
    );
  }
}
